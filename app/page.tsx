import Stripe from "stripe";
import Product from "./components/Product";

const getProducts = async () => {
  if (!process.env.STRIPE_SECRET_KEY)
    throw new Error("Missing Stripe secret key");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });
  const products = await stripe.products.list();
  const productsWithPrices = await Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({ product: product.id });
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images[0],
        currency: prices.data[0].currency,
        unit_amount: prices.data[0].unit_amount,
      };
    })
  );
  return productsWithPrices;
};

export default async function Home() {
  const products = await getProducts();

  return (
    <main>
      <div>
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </main>
  );
}
