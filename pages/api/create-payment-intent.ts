import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { CartItemType } from "@/types/CartItemType";
import { prisma } from "@/util/prisma";
import { UserSessionType } from "@/types/UserSessionType";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const calculateOrderAmount = (items: CartItemType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_amount * item.quantity;
  }, 0);

  return totalPrice;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //GET user
  const userSession: UserSessionType | null = await getServerSession(
    req,
    res,
    authOptions
  );

  if (!userSession || !userSession.user) {
    res.status(200).json({ message: "Not logged in" });
    return;
  }
  //Extract the data from the body
  const { items, payment_intent_id } = req.body;

  //Create the order data
  const orderData = {
    user: { connect: { id: userSession.user.id } },
    amount: calculateOrderAmount(items),
    currency: "usd",
    status: "pending",
    paymentIntentId: payment_intent_id,
    cartItems: {
      create: items.map((item: CartItemType) => ({
        name: item.name,
        description: item.description || null,
        unit_amount: item.unit_amount, // TODO: @Jason, check if this is ok. parseFloat() on a number causes TS error bc parseFloat only takes string
        image: item.image,
        quantity: item.quantity,
      })),
    },
  };

  //Check if the payment intent exists, just update the order
  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: calculateOrderAmount(items) }
      );
      //Fetch order with the cartItems
      const existing_order = await prisma.order.findFirst({
        where: { paymentIntentId: updated_intent.id },
        include: { cartItems: true },
      });
      if (!existing_order) {
        res.status(400).json({ message: "Invalid Payment Intent" });
      }

      //Update Existing Order
      const updated_order = await prisma.order.update({
        where: { id: existing_order?.id },
        data: {
          amount: calculateOrderAmount(items),
          cartItems: {
            deleteMany: {},
            create: items.map((item: CartItemType) => ({
              name: item.name,
              description: item.description || null,
              unit_amount: item.unit_amount, //TODO: check this too
              image: item.image,
              quantity: item.quantity,
            })),
          },
        },
      });
      res.status(200).json({ paymentIntent: updated_intent });
      return;
    }
  } else {
    //Create a new order with Prisma
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    orderData.paymentIntentId = paymentIntent.id;
    const newOrder = await prisma.order.create({
      data: orderData,
    });
    res.status(200).json({
      client_secret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  }
}
