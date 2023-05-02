import styles from "@/styles/Product.module.css";
import Image from "next/image";
import { formatPrice } from "@/util/PriceFormat";
import Link from "next/link";
import { ProductTypes } from "@/types/ProductTypes";
// import stewie from "@/public/stewie.gif";

export default function ProductCard({
  id,
  name,
  description,
  image,
  unit_amount,
  currency,
}: ProductTypes) {
  return (
    <div className={styles.productCardContainer}>
      <Link
        href={{
          pathname: `/product/${id}`,
          query: { name, image, unit_amount, id, description, currency },
        }}
      >
        <div className={styles.productCardImageContainer}>
          <Image
            src={image}
            alt={name}
            fill
            className={styles.productCardImage}
            // TODO: Figure out how to use blurDataURL
            // placeholder="blur"
            // blurDataURL={stewie.src}
          />
        </div>
        <div className={styles.productCardDetails}>
          <p className={styles.productCardName}>{name}</p>
          <p className={styles.productCardPrice}>
            {unit_amount !== null ? formatPrice(unit_amount) : "N/A"}
          </p>
        </div>
      </Link>
    </div>
  );
}
