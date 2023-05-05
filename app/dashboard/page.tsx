import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { formatPrice } from "@/util/PriceFormat";
import Image from "next/image";

//TODO: look into this since it currently updates with a refresh without this export
// export const revalidate = 0;

const fetchOrders = async () => {
  const prisma = new PrismaClient();
  const userSession = await getServerSession(authOptions);
  if (!userSession) {
    return null;
  }

  //The Callback from our authOptions provides access to other properties like the user id
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
  if (orders === null) {
    return <div>You need to be logged in to view your orders</div>;
  }

  return (
    <div>
      {orders.length === 0 ? (
        <div>
          <h1>No orders place</h1>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id}>
              <h2>Order reference: {order.id}</h2>
              <p>Time: {new Date(order.createdDate).toDateString()}</p>
              {/* TODO: set a certain background color for completed orders */}
              <p>
                Status: <span>{order.status}</span>
              </p>
              <p>Total: {formatPrice(order.amount)}</p>
              <div>
                {order.products.map((product) => (
                  <div key={product.id}>
                    <h2>{product.name}</h2>
                    <div>
                      <Image
                        src={product.image!}
                        width={36}
                        height={36}
                        alt={product.name}
                      />
                      <p>{formatPrice(product.unit_amount)}</p>
                      <p>Quantity: {product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
