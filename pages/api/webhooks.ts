import Stripe from "stripe";
import { prisma } from "@/util/prisma";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: Look whether we want to read the request body using buffer or follow Stripe docs
  const buf = await buffer(req);
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send("Missing Stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    console.log("stripe webhook event");
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err}`);
  }

  switch (event.type) {
    case "payment_intent.created":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was created!");
      break;
    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;
      //Check the type of the payment intent since Prisma excepts this field to be either a string or undefined
      if (typeof charge.payment_intent === "string") {
        const order = await prisma.order.update({
          where: { paymentIntentId: charge.payment_intent },
          data: { status: "completed" },
        });
      }
      console.log("Order status has been marked complete in Prisma");
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}
