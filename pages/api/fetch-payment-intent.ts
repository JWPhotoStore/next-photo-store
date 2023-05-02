import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSession = await getServerSession(req, res, authOptions);

  //TODO: discuss whether we need this for user thats not signed in
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" });
    return;
  } else {
    //Fetch the active order and include the products
    const activeOrder = await prisma.order.findFirst({
      where: {
        userEmail: userSession.user?.email as string,
        status: "pending",
      },
      select: {
        paymentIntentID: true,
        currency: true,
        products: {
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
    }
    // else {
    //   res.status(200).json({ activeOrder: false });
    // }
  }
}
