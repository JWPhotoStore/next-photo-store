import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //GET user
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }
  //Extract the data from the body
  const { items, payment_intent_id } = req.body;

  //Data necessary for the order
  res.status(200).json({ userSession });
  return;
  // const orderData = {
  //   user: { connect: { id: userSession.user?.id } },
  // };
}
