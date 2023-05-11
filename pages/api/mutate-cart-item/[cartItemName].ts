import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/util/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO: discuss whether we need this for user thats not signed in
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }
  const { cartItemName } = req.query;
  console.log("cartItemName is ", cartItemName);

  //Get active order and include the cartItems
  const activeOrder = await prisma.order.findFirst({
    where: {
      userEmail: userSession.user?.email as string,
      status: "pending",
    },
    select: {
      paymentIntentID: true,
      currency: true,
      cartItems: {
        select: {
          id: true,
          name: true,
          description: true,
          unit_amount: true,
          image: true,
          quantity: true,
        },
      },
    },
  });

  if (!activeOrder) {
    res.status(404).json({ message: "No active orders" });
    return;
  }

  if (req.method === "DELETE") {
    const cartItemToDelete = activeOrder.cartItems.find(
      (cI) => cI.name === cartItemName
    );

    if (!cartItemToDelete)
      throw new Error("Could not find matching cart item in active order.");

    try {
      await prisma.cartItem.delete({
        where: {
          id: cartItemToDelete.id,
        },
      });
      res.status(200).json({ message: "Cart item deleted." });
    } catch (e) {
      res
        .status(404)
        .json({ error: e, message: "Could not delete cart item." });
    }
  }
}
