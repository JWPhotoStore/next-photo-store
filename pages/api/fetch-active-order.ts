import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/util/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { UserSessionType } from "@/types/UserSessionType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSession: UserSessionType | null = await getServerSession(
    req,
    res,
    authOptions
  );

  //TODO: discuss whether we need this for user thats not signed in
  if (!userSession?.user) {
    res.status(200).json({ message: "Not logged in" });
  } else {
    //Fetch the active order and include the cartItems
    const activeOrder = await prisma.order.findFirst({
      where: {
        userEmail: userSession.user?.email as string,
        status: "pending",
      },
      select: {
        paymentIntentId: true,
        currency: true,
        cartItems: {
          select: {
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
      res.status(200).json(activeOrder);
    } else {
      res.status(200).json({ message: "No active orders" });
    }
  }
}
