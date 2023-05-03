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
    <div className={styles.productDetails}>
      <div>
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
          {/* TODO - Providers here to the children may not actually give access to updated store */}
          <Providers>
            <Quantity details={searchParams} />
            {/* <AddToCart {...searchParams} /> */}
          </Providers>
        </div>
      </div>
    </div>
  );
}
