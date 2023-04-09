import styles from "@/styles/Product.module.css";
import Image from "next/image";
import { SearchParamTypes } from "@/types/SearchParamsTypes";
import formatPrice from "@/util/PriceFormat";

export default async function Product({ searchParams }: SearchParamTypes) {
  return (
    <div className={styles.productDetails}>
      <Image
        src={searchParams.image}
        alt={searchParams.name}
        width={600}
        height={600}
      />
      <div>
        <h1>{searchParams.name}</h1>
        <p>{searchParams.description}</p>
        <div>
          <p>
            {searchParams.unit_amount !== null
              ? formatPrice(searchParams.unit_amount)
              : "N/A"}
          </p>
        </div>
        <button className={styles.addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
