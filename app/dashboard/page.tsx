import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const fetchOrders = async () => {
  const prisma = new PrismaClient();
  const userSession = await getServerSession(authOptions);
  if (!userSession) {
    return { message: "Not logged in" };
  }

  const orders = await prisma.order.findMany({
    where: { userId: userSession?.user?.id },
    include: {
      products: true,
    },
  });

  return orders;
};

export default async function Dashboard() {
  const orders = await fetchOrders();
  console.log(orders);
  return <div>Dashboard</div>;
}
