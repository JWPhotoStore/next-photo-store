import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/util/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

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
