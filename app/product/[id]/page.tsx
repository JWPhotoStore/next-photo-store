import styles from "@/styles/Product.module.css";
import Image from "next/image";
import { SearchParamsType } from "@/types/SearchParamsType";
import { formatPrice } from "@/util/PriceFormat";
import AddToCart from "@/app/components/AddToCart";
import Providers from "@/app/components/Providers";
import { ProductType } from "@/types/ProductType";
import Quantity from "@/app/components/Quantity";

type ProductPropsType = {
  params: { id: string };
  searchParams: ProductType;
};

export default async function Product({ searchParams }: ProductPropsType) {
  return (
    <div className={styles.productPage}>
      <div className={styles.singleProductContainer}>
        <Image
          src={searchParams.image}
          alt={searchParams.name}
          width={300}
          height={300}
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
            {/* <AddToCart {...searchParams} /> */}
          </Providers>
        </div>
      </div>
    </div>
  );
}
