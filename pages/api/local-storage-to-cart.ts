import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/util/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { UserSessionType } from "@/types/UserSessionType";
import { CartItemBackendType, CartItemType } from "@/types/CartItemType";
import {
  sumItemsAndQuantity,
  calculateCartItemsSum,
} from "@/util/cart-item-utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const userSession: UserSessionType | null = await getServerSession(
  //   req,
  //   res,
  //   authOptions
  // );

  // if (!userSession?.user) {
  //   res.status(403).json({ message: "Not logged in" });
  //   return;
  // }

  // const cartItemsFromReq: CartItemBackendType[] = req.body;
  const { cartItems: cartItemsFromReq } = req.body;
  console.log(" cartItemsFromReq whole thing", cartItemsFromReq);
  const paymentIntentId = cartItemsFromReq[0].piId;
  // debugger;
  console.log(" cartItemsFromReq[0] ", cartItemsFromReq[0]);
  console.log("cartItemsFromReq type of", typeof cartItemsFromReq);
  // console.log("paymentIntentId: ", paymentIntentId);

  if (paymentIntentId) {
    console.log("there is a paymentIntentId here", paymentIntentId);

    //Fetch cartItems with the paymentIntentId
    const order = await prisma.order.findUnique({
      where: {
        paymentIntentId: paymentIntentId,
      },
      select: {
        cartItems: true,
      },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    const { cartItems } = order;
    const newItems = [];

    for await (const cartItemFromReq of cartItemsFromReq) {
      const cartItemFromDb = cartItems.find(
        (i) => i.name === cartItemFromReq.name
      );
      console.log("cartItemFromDb ", cartItemFromDb);
      console.log("cartItemFromReq ", cartItemFromReq);
      if (cartItemFromDb) {
        // Update order total and cartItems quantity in cartItem from request exists
        const { unit_amount, quantity } = cartItemFromReq;
        const addedTotal = quantity * parseFloat(unit_amount);
        const updatedOrderWithExistingItem = await prisma.order.update({
          where: {
            paymentIntentId: paymentIntentId,
          },
          data: {
            amount: {
              increment: addedTotal,
            },
            cartItems: {
              update: {
                where: {
                  id: cartItemFromDb?.id,
                },
                data: {
                  quantity: {
                    increment: quantity,
                  },
                },
              },
            },
          },
        });
        console.log(
          "updatedOrderWithExistingItem ",
          updatedOrderWithExistingItem
        );
      } else {
        const {
          name,
          description,
          unit_amount,
          image,
          quantity,
          stripeProductId,
        } = cartItemFromReq; // need to strip off paymentIntentId
        newItems.push({
          name,
          description,
          unit_amount: parseFloat(unit_amount),
          image,
          quantity,
          stripeProductId,
        });
      }
    }

    // Update order total & associated cartItems. Create new cartItems using newItems array
    const newItemsAddedTotal = sumItemsAndQuantity(newItems);
    const updatedOrderWithNewItems = await prisma.order.update({
      where: {
        paymentIntentId: paymentIntentId,
      },
      data: {
        amount: {
          increment: newItemsAddedTotal,
        },
        cartItems: {
          createMany: {
            data: newItems,
          },
        },
      },
    });
    console.log("updatedOrderWithNewItems ", updatedOrderWithNewItems);
    res
      .status(200)
      .json({ message: "New cart items created and added to order." });
  } else {
    console.log("there is NO paymentIntentId yet");
    const orderAmount = calculateCartItemsSum(cartItemsFromReq);
    console.log("orderAmount is ", orderAmount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    const cartItemsWithoutpiIdKey = cartItemsFromReq.map((cI) => ({
      name: cI.name,
      description: cI.description,
      unit_amount: parseFloat(cI.unit_amount),
      image: cI.image,
      quantity: cI.quantity,
      stripeProductId: cI.stripeProductId,
    }));

    const orderData = {
      // user: { connect: { email: userSession.user?.email! } },
      user: { connect: { email: "jrhykushii@gmail.com" } },
      amount: orderAmount,
      currency: paymentIntent.currency,
      status: "pending",
      paymentIntentId: paymentIntent.id,
      cartItems: {
        createMany: {
          data: cartItemsWithoutpiIdKey,
        },
      },
    };

    const { cartItems: newCartItems } = await prisma.order.create({
      data: orderData,
      select: {
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

    res.status(200).json({
      message: "hit the else!",
      client_secret: paymentIntent.client_secret,
      paymentIntent: paymentIntent.id,
      cartItems: { newCartItems },
    });

    //Create a paymentIntent in Stripe

    // //Updating the paymentIntentId on the order
    // orderData.paymentIntentId = paymentIntent.id;
    // // Create a new order in prisma and returns the array of cartItems
    // const { cartItems } = await prisma.order.create({
    //   data: orderData,
    //   select: {
    //     cartItems: {
    //       select: {
    //         name: true,
    //         description: true,
    //         unit_amount: true,
    //         image: true,
    //         quantity: true,
    //         stripeProductId: true,
    //       },
    //     },
    //   },
    // });
    // //Store the newly added cartItem and return to client
    // const addedItem = cartItems[0];
    // // console.log(addedItem);
    // res.status(200).json({
    //   client_secret: paymentIntent.client_secret,
    //   paymentIntentId: paymentIntent.id,
    //   //Added currency property for CartItemType requirement
    //   cartItem: { ...addedItem, currency: currency },
    // });
    // res.status(200).json({ message: "hit the else." });
  }
}
