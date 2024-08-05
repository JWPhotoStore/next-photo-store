import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/util/prisma';
import { authOptions } from './auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { UserSessionType } from '@/types/UserSessionType';
import { calculateCartItemsSum } from '@/util/cart-item-utils';
import { CartItemBareType, CartItemType } from '@/types/CartItemType';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSession: UserSessionType | null = await getServerSession(
    req,
    res,
    authOptions
  );

  if (!userSession?.user) {
    return res.status(200).json({ message: 'Not logged in' });
  } else {
    const { cartItemsLS } = req.body;

    try {
      //Fetch the active Order
      const activeOrder = await prisma.order.findFirst({
        where: {
          userEmail: userSession.user?.email as string,
          status: 'pending',
        },
        select: {
          paymentIntentId: true,
          cartItems: {
            select: {
              name: true,
              description: true,
              unit_amount: true,
              image: true,
              quantity: true,
              stripeProductId: true,
            },
          },
        },
      });

      if (activeOrder) {
        const { paymentIntentId, cartItems } = activeOrder;
        const currentCartItems: { [key: string]: CartItemBareType } = {};

        for (const cartItem of cartItems) {
          currentCartItems[cartItem.name] = cartItem;
        }

        const updatedCartItems = [];
        let amountAdj = 0;

        for (const cartItem of cartItemsLS) {
          const unit_amount = parseFloat(cartItem.unit_amount);
          amountAdj += cartItem.quantity * unit_amount;

          if (cartItem.name in currentCartItems) {
            const cI = currentCartItems[cartItem.name];
            cI.quantity += cartItem.quantity;
          } else {
            const cI = { ...cartItem, unit_amount: unit_amount };
            delete cI['currency'];
            updatedCartItems.push(cI);
          }
        }

        for (const cartItem in currentCartItems) {
          updatedCartItems.push(currentCartItems[cartItem]);
        }

        console.log('updateCartItems array: ', updatedCartItems);

        if (paymentIntentId) {
          const updatedOrder = await prisma.order.update({
            where: {
              paymentIntentId,
            },
            data: {
              cartItems: {
                deleteMany: {},
                createMany: {
                  data: updatedCartItems,
                },
              },
              amount: {
                increment: amountAdj,
              },
            },
          });

          console.log('updated Order: ', updatedOrder);
        }
      } else {
        try {
          const { cartItemsLS } = req.body;
          const sanitizedCartItems = cartItemsLS.map((cI) => {
            cI.unit_amount = parseFloat(cI.unit_amount);
            delete cI['currency'];
            return cI;
          });

          const totalOrderAmount = calculateCartItemsSum(cartItemsLS);

          const paymentIntent = await stripe.paymentIntents.create({
            amount: totalOrderAmount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
          });

          const orderData = {
            user: { connect: { email: userSession.user?.email! } },
            amount: totalOrderAmount,
            currency: 'usd',
            status: 'pending',
            paymentIntentId: paymentIntent.id,
            cartItems: {
              createMany: {
                data: sanitizedCartItems,
              },
            },
          };

          await prisma.order.create({
            data: orderData,
          });

          return res
            .status(200)
            .json({ message: 'cart items from LS has been added' });
        } catch (err) {
          if (err) console.error(err);
        }
      }
    } catch (err) {
      if (err) {
        console.log(err);
        return res
          .status(200)
          .json({ message: 'Could not add the items from LS to database' });
      }
    }
  }

  return res
    .status(200)
    .json({ message: 'LS cart items have been successfully added' });
}
