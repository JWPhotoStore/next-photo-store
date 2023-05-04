import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO: discuss whether we need this for user thats not signed in
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" });
  } else {
    //Get active order and include the cartItems
    const activeOrder = await prisma.order.findFirst({
      where: {
        // userEmail: "jrhykushii@gmail.com",
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

    const cartItemName = req.body;

    if (activeOrder) {
      const cartItemToDelete = activeOrder.cartItems.findLast(
        (cI) => cI.name === cartItemName
      );

      if (!cartItemToDelete)
        throw new Error("Could not find matching cart item in active order.");
      if (req.method === "DELETE")
        try {
          await prisma.cartItem.delete({
            where: {
              id: cartItemToDelete.id,
            },
          });
          res.status(200).send("Nice. Deleted.");
        } catch (e) {
          res
            .status(404)
            .json({ error: e, message: "Could not delete cart item." });
        }
    } else {
      res.status(404).json({ message: "No active orders" });
    }
  }
}
