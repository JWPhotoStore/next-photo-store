import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/util/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { UpdateMethodType } from "@/types/UpdateMethodType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO: discuss whether we need this for user thats not signed in

  console.log("did this hit?");
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }

  //Get active order and include the cartItems
  const activeOrder = await prisma.order.findFirst({
    where: {
      userEmail: userSession.user?.email as string,
      status: "pending",
    },
    include: {
      cartItems: true,
    },
  });

  //TODO: Discuss this - Will only need to handle this scenario if we allow users to add items to a cart before they're logged in
  if (!activeOrder) {
    res.status(200).json({ message: "No active orders" });
    return;
  }

  const { name, unit_amount, quantity } = req.body;
  const updateAmountMethod: UpdateMethodType = {};
  const updateQuantityMethod: UpdateMethodType = {};

  const cartItemToUpdate = activeOrder.cartItems.find((cI) => cI.name === name);

  if (cartItemToUpdate) {
    const quantityChange = quantity - cartItemToUpdate.quantity;
    const updateAmount = Math.abs(quantityChange) * unit_amount;

    try {
      if (quantityChange > 0) {
        updateAmountMethod.increment = updateAmount;
        updateQuantityMethod.increment = Math.abs(quantityChange);
      }
      if (quantityChange < 0) {
        updateAmountMethod.decrement = updateAmount;
        updateQuantityMethod.decrement = Math.abs(quantityChange);
      }

      console.log("updateAmountMethod", updateAmountMethod);
      console.log("updateQuantityMethod", updateQuantityMethod);

      await prisma.order.update({
        where: {
          id: activeOrder.id,
        },
        data: {
          amount: updateAmountMethod,
          cartItems: {
            update: {
              where: {
                id: cartItemToUpdate.id,
              },
              data: {
                quantity: updateQuantityMethod,
              },
            },
          },
        },
      });

      return res.status(200).json({ message: "Quantity has been updated" });
    } catch (err) {
      return res
        .status(404)
        .json({ message: "Could not update cart item quantity" });
    }
  }

  return res.status(404).json({ message: "No cart item found." });
}
