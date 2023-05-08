import styles from "@/styles/Product.module.css";
import Image from "next/image";
import { SearchParamsType } from "@/types/SearchParamsType";
import { formatPrice } from "@/util/PriceFormat";
import Providers from "@/app/components/Providers";
import Quantity from "@/app/components/Quantity";

export default async function Product({ searchParams }: SearchParamsType) {
  return (
    <div className={styles.productPage}>
      <div className={styles.singleProductContainer}>
        <Image
          src={searchParams.image}
          alt={searchParams.name}
          width={300}
          height={300}
          priority={true}
        />
        <div className={styles.singleProductDetails}>
          <h2>{searchParams.name}</h2>
          <p>{searchParams.description}</p>
          <p>
            {searchParams.unit_amount !== null
              ? formatPrice(searchParams.unit_amount)
              : "N/A"}
          </p>
          <Providers>
            <Quantity details={searchParams} />
          </Providers>
        </div>
      </div>
    </div>
  );
}
