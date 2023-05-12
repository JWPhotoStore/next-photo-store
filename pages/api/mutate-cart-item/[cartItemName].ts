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

  // TODO: Discuss this - Will only need to handle this scenario if we allow users to add items to a cart before they're logged in
  if (!activeOrder) {
    res.status(200).json({ message: "No active orders" });
    return;
  }

  //When deleting a cartItem
  const { cartItemName } = req.query;
  const updateAmountMethod: UpdateMethodType = {};

  const cartItemToDelete = activeOrder.cartItems.find(
    (cI) => cI.name === cartItemName
  );

  if (cartItemToDelete) {
    try {
      const { unit_amount, quantity } = cartItemToDelete;
      const updateAmount = unit_amount * quantity;
      updateAmountMethod.decrement = updateAmount;

      //Updates order total amount and then removes the item in the order
      await prisma.order.update({
        where: {
          id: activeOrder.id,
        },
        data: {
          amount: updateAmountMethod,
          cartItems: {
            delete: {
              id: cartItemToDelete.id,
            },
          },
        },
      });
      return res.status(200).json({ message: "Cart item deleted." });
    } catch (e) {
      return res
        .status(404)
        .json({ error: e, message: "Could not delete cart item." });
    }
  }

  return res.status(404).json({ message: "No cart item found." });
}
