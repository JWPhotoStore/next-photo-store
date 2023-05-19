import Stripe from "stripe";
import { prisma } from "@/util/prisma";
import { NextApiRequest, NextApiResponse } from "next";
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
  } else {
    //Fetch the active order
    const activeOrder = await prisma.order.findFirst({
      where: {
        userEmail: userSession.user?.email as string,
        status: "pending",
      },
    });

    //Update Stripe with the total amount in our database
    if (activeOrder && activeOrder.paymentIntentId) {
      const { paymentIntentId, amount } = activeOrder;

      const stripeObj = await stripe.paymentIntents.update(paymentIntentId, {
        amount: amount,
      });

      return res.status(200).json({ clientSecret: stripeObj.client_secret });
    }

    return res.status(200).json({ message: "No active order was found" });
  }
}
