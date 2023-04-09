import styles from '@/styles/Product.module.css';
import Image from 'next/image';
import formatPrice from '@/util/PriceFormat';
import Link from 'next/link';

type ProductProps = {
  id: string;
  name: string;
  description: string | null;
  image: string;
  currency: string;
  price: number | null;
};

export default function Product({
  id,
  name,
  description,
  image,
  price,
  currency,
}: ProductProps) {
  return (
    <Link
      href={{ pathname: `/product/${id}`, query: { name, image, price, id } }}
    >
      <div>
        <Image
          src={image}
          alt={name}
          width={400}
          height={400}
          className={styles.imageInfo}
        />
        <div className={styles.productContainer}>
          <h2>{name}</h2>
          <h2 className={styles.priceInfo}>
            {price !== null ? formatPrice(price) : 'N/A'}
          </h2>
        </div>
        {/* <p>{description}</p> */}
      </div>
    </Link>
  );
}
