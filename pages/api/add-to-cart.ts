import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/util/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { UserSessionType } from "@/types/UserSessionType";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
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
    res.status(200).json({ message: "Not logged in" });
    return;
  }

  const {
    name,
    description,
    image,
    unit_amount,
    currency,
    quantity,
    paymentIntentId,
    stripeProductId,
  } = req.body;

  const orderData = {
    user: { connect: { email: userSession.user?.email! } },
    amount: quantity * parseFloat(unit_amount),
    currency: currency,
    status: "pending",
    paymentIntentId: paymentIntentId,
    cartItems: {
      create: {
        name,
        description,
        unit_amount: parseFloat(unit_amount),
        image,
        quantity,
        stripeProductId,
      },
    },
  };

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
    //Get the cartItem that matches the name of the item being added
    const cartItem = cartItems.find((cartItem) => cartItem.name === name);
    const addedTotal = quantity * parseFloat(unit_amount);

    //case when cartItem already exist in the customer's cart
    if (cartItem) {
      const itemID = cartItem?.id;
      const updatedOrder = await prisma.order.update({
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
                id: itemID,
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
      res.status(200).json({ message: "Existing cart item updated in order." });
    }
    //When adding a new cartItem to the user's cart
    else {
      //Update the order total amount and create the new cartItems
      const updatedOrder = await prisma.order.update({
        where: {
          paymentIntentId: paymentIntentId,
        },
        data: {
          amount: {
            increment: addedTotal,
          },
          cartItems: {
            create: {
              name,
              description,
              unit_amount: parseFloat(unit_amount),
              image,
              quantity,
              stripeProductId,
            },
          },
        },
      });
      res.status(200).json({ message: "New cart item added to order." });
    }
    //TODO: Return all the cartItems back to the client
  } else {
    console.log("there is NO paymentIntentId yet");

    //Create a paymentIntent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderData.amount,
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });

    //Updating the paymentIntentId on the order
    orderData.paymentIntentId = paymentIntent.id;

    // Create a new order in prisma and returns the array of cartItems
    const { cartItems } = await prisma.order.create({
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

    //Store the newly added cartItem and return to client
    const addedItem = cartItems[0];
    // console.log(addedItem);

    res.status(200).json({
      paymentIntentId: paymentIntent.id,
      cartItem: { ...addedItem, currency: currency },
    });
  }
}
