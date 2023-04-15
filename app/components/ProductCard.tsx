import styles from "@/styles/Product.module.css";
import Image from "next/image";
import formatPrice from "@/util/PriceFormat";
import Link from "next/link";
import { ProductTypes } from "@/types/ProductTypes";

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
          />
        </div>
        <div className={styles.productCardDetails}>
          <h3 className={styles.productCardName}>{name}</h3>
          <h3 className={styles.productCardPrice}>
            {unit_amount !== null ? formatPrice(unit_amount) : "N/A"}
          </h3>
        </div>
      </Link>
    </div>
  );
}
