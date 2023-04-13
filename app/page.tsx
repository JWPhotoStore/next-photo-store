import Stripe from "stripe";
import ProductCard from "./components/ProductCard";
import styles from "@/styles/Product.module.css";

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
      const unitAmount = prices.data[0].unit_amount ?? 100000000;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images[0],
        currency: prices.data[0].currency,
        unit_amount: unitAmount,
      };
    })
  );
  return productsWithPrices;
};

export default async function Home() {
  const products = await getProducts();

  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
