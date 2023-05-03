import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }

  const {
    name,
    description,
    image,
    unit_amount,
    currency,
    quantity,
    paymentIntentID,
  } = req.body;

  const orderData = {
    user: { connect: { email: userSession.user?.email! } },
    amount: quantity * parseFloat(unit_amount),
    currency: currency,
    status: "pending",
    paymentIntentID: paymentIntentID,
    cartItems: {
      create: {
        name,
        description,
        unit_amount: parseFloat(unit_amount),
        image,
        quantity,
      },
    },
  };

  if (paymentIntentID) {
    console.log("there is a paymentIntentID here", paymentIntentID);

    //Fetch cartItems with the paymentIntentID
    const order = await prisma.order.findUnique({
      where: {
        paymentIntentID: paymentIntentID,
      },
      select: {
        cartItems: true,
      },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    const { cartItems } = order;
    //Get the cartItem that matches the name of the item being added
    const cartItem = cart.find((cartItem) => cartItem.name === name);

    //case when cartItem already exist in the customer's cart
    if (cartItem) {
      const itemID = cartItem.id;
      const addedTotal = quantity * parseFloat(unit_amount);
      const updatedOrder = await prisma.order.update({
        where: {
          paymentIntentID: paymentIntentID,
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
                unit_amount: {
                  increment: parseFloat(unit_amount),
                },
                quantity: {
                  increment: quantity,
                },
              },
            },
          },
        },
      });
    }
    //case when adding a new cartItem to the user's cart
    else {
      const newItem = await prisma.cartItem.create({
        data: {
          name,
          description,
          unit_amount: parseFloat(unit_amount),
          image,
          quantity,
          order: { connect: { paymentIntentID: paymentIntentID } },
        },
      });
    }

    //TODO: Return all the cartItems back to the client
  } else {
    console.log("there is NO paymentIntentID yet");

    //Create a paymentIntent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderData.amount,
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });

    //Updating the paymentIntentID on the order
    orderData.paymentIntentID = paymentIntent.id;

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
          },
        },
      },
    });

    //Store the newly added cartItem and return to client
    const addedItem = cartItems[0];
    console.log(addedItem);

    res.status(200).json({
      client_secret: paymentIntent.client_secret,
      id: paymentIntent.id,
      //Added currency property for CartItemType requirement
      cartItem: { ...addedItem, currency: currency },
    });
  }
}
