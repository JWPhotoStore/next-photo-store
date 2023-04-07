import Image from "next/image";

type ProductProps = {
  id: string;
  name: string;
  description: string | null;
  image: string;
  currency: string;
  price: number | null;
};

export default function Product({
  name,
  description,
  image,
  price,
  currency,
}: ProductProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
      <Image src={image} alt={name} width={400} height={400} />
    </div>
  );
}
