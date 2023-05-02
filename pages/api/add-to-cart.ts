import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { calculateOrderAmount } from "@/util/PriceFormat";

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
    products: {
      create: {
        name,
        description,
        unit_amount: parseFloat(unit_amount),
        image,
        quantity,
      },
    },
  };

  console.log("did this hit add-to-cart");

  if (paymentIntentID) {
    console.log("there is a paymentIntentID here", paymentIntentID);

    //Fetch the Stripe intent object
    // const current_intent = await stripe.paymentIntents.retrieve(
    //   paymentIntentID
    // );

    //Update stripe total amount

    //Fetch order with the paymentIntentID and include products

    //Fetch products with the paymentIntentID
    const { products } = await prisma.order.findUnique({
      where: {
        paymentIntentID: paymentIntentID,
      },
      select: {
        products: true,
      },
    });

    console.log(products, " this is the products");

    //Find the ID of the item being added to cart
    const productID = products.filter((product) => {
      return product.name === name ? product.id : null;
    });

    //If item can be found, use the ID of that item to update in the products table
    // if (!productID) {
    //   const addedItem = await prisma.product.create({
    //     data: {
    //       name,
    //       description,
    //       unit_amount: parseFloat(unit_amount),
    //       image,
    //       quantity,
    //       order: { connect: { paymentIntentID: paymentIntentID } },
    //     },
    //   });
    // } else {
    //   const updatedItem = await prisma.product.update({
    //     where: {
    //       id: productID,
    //     },
    //     data: {
    //       quantity: { increment: quantity },
    //     },
    //   });

    //   // update order total amount
    // }

    //Else add a new product to the products table

    // res.status(200).json(item);
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

    // Create a new order in prisma
    const newOrder = await prisma.order.create({
      data: orderData,
      select: {
        products: true,
      },
    });

    console.log(newOrder);

    res.status(200).json({
      client_secret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  }
}
