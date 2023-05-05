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

    if (activeOrder) {
      if (req.method === "DELETE") {
        const cartItemName = req.body;
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
          res.status(200).json({ message: "Nice. Deleted." });
        } catch (e) {
          res
            .status(404)
            .json({ error: e, message: "Could not delete cart item." });
        }
      }
      if (req.method === "PATCH") {
        const { name, quantity } = req.body;
        const cartItemToUpdate = activeOrder.cartItems.find(
          (cI) => cI.name === name
        );
        if (!cartItemToUpdate) throw new Error("No cart item found.");
        try {
          await prisma.cartItem.update({
            where: {
              id: cartItemToUpdate.id,
            },
            data: {
              quantity: quantity,
            },
          });
          res.status(200).json({ message: "Nice. Quantity Updated." });
        } catch (err) {
          res.status(404).json({ message: "No cart item found." });
        }
      }
    } else {
      res.status(404).json({ message: "No active orders" });
    }
  }
}
