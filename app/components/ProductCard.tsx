import styles from "@/styles/Product.module.css";
import Image from "next/image";
import { formatPrice } from "@/util/PriceFormat";
import Link from "next/link";
import { ProductType } from "@/types/ProductType";
// import stewie from "@/public/stewie.gif";

export default function ProductCard({
  id,
  name,
  description,
  image,
  unit_amount,
  currency,
}: ProductType) {
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
            sizes="(max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw"
            priority={true}
            // TODO: Figure out how to use blurDataURL
            // placeholder="blur"
            // blurDataURL={stewie.src}
          />
        </div>
      </Link>
      <div className={styles.productCardDetails}>
        <p className={styles.productCardName}>{name}</p>
        <p className={styles.productCardPrice}>
          {unit_amount !== null ? formatPrice(unit_amount) : "N/A"}
        </p>
      </div>
    </div>
  );
}
