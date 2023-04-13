import styles from "@/styles/Product.module.css";
import Image from "next/image";
import formatPrice from "@/util/PriceFormat";
import Link from "next/link";
import { ProductTypes } from "@/types/ProductTypes";

export default function Product({
  id,
  name,
  description,
  image,
  unit_amount,
  currency,
}: ProductTypes) {
  return (
    <Link
      href={{
        pathname: `/product/${id}`,
        query: { name, image, unit_amount, id, description, currency },
      }}
    >
      <div className="productCard">
        <Image
          src={image}
          alt={name}
          width={400}
          height={400}
          className={styles.imageInfo}
        />
        <div className={styles.productContainer}>
          <h2>{name}</h2>
          <p className={styles.priceInfo}>
            {unit_amount !== null ? formatPrice(unit_amount) : "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
}
