import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/util/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

type CartItemTypes = {
  name: string;
  description: string;
  image: string;
  currency: string;
  unit_amount: string;
  quantity: number;
  stripeProductId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cartItemsLS, paymentIntentId } = req.body;

  console.log("did this hit??");

  try {
    //Fetch cartItems with the paymentIntentId
    const order = await prisma.order.findUnique({
      where: {
        paymentIntentId: paymentIntentId,
      },
      select: {
        cartItems: true,
      },
    });

    if (order) {
      const { cartItems } = order;
      const currentCartItems = {};

      for (const cartItem of cartItems) {
        currentCartItems[cartItem.name] = cartItem.quantity;
      }

      console.log("currentCartItems: ", currentCartItems);

      const formattedCartItemsLS = cartItemsLS.map((cI: CartItemTypes) => {
        const unit_amount = parseFloat(cI.unit_amount);

        if (cI.name in currentCartItems) {
          console.log("database unit_amount", currentCartItems[cI.name]);
          console.log(typeof currentCartItems[cI.name]);

          console.log("request unit_amount: ", unit_amount);
          console.log(typeof unit_amount);

          const updatedQuantity = cI.quantity + currentCartItems[cI.name];

          return {
            name: cI.name,
            description: cI.description,
            unit_amount: unit_amount,
            image: cI.image,
            quantity: updatedQuantity,
            stripeProductId: cI.stripeProductId,
          };
        } else {
          return {
            name: cI.name,
            description: cI.description,
            unit_amount: unit_amount,
            image: cI.image,
            quantity: cI.quantity,
            stripeProductId: cI.stripeProductId,
          };
        }
      });

      console.log("formatted Cart Items", formattedCartItemsLS);

      const updatedOrder = await prisma.order.update({
        where: {
          paymentIntentId,
        },
        data: {
          cartItems: {
            deleteMany: {},
            createMany: {
              data: formattedCartItemsLS,
            },
          },
        },
      });

      console.log("updated Order: ", updatedOrder);
    }
  } catch (err) {
    if (err) console.log(err);
  }

  res.status(200).json({ message: "coming from add-to-cart-ls" });
}
