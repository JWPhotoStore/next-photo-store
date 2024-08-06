import Stripe from 'stripe';
import { prisma } from '@/util/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { UserSessionType } from '@/types/UserSessionType';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSession: UserSessionType | null = await getServerSession(
    req,
    res,
    authOptions
  );

  if (!userSession?.user) {
    res.status(401).json({ message: 'User is not logged in' });
  }

  try {
    const paymentIntentId = req.body;

    const order = await prisma.order.findFirst({
      where: {
        paymentIntentId: paymentIntentId,
        status: 'completed',
      },
    });

    if (order) {
      return res.status(200).json({ orderComplete: true });
    } else {
      throw new Error('Error while trying to complete order');
    }
  } catch (err) {
    console.log(`Error in confirm-payments: ${err}`);
    return res
      .status(500)
      .json({ message: 'Order did not successfully update' });
  }
}
