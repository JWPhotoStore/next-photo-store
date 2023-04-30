import { ProductTypes } from "@/types/ProductTypes";

interface AddToCart_newType extends ProductTypes {
  quantity: number;
}

export default function AddToCart_new({
  id,
  name,
  description,
  image,
  unit_amount,
  currency,
  quantity,
}: AddToCart_newType) {
  const handleAdd = (e) => {
    e.preventDefault();

    console.log("This is the object, ", {
      id,
      name,
      description,
      image,
      unit_amount,
      currency,
      quantity,
    });
  };

  return <button onClick={handleAdd}>Add new</button>;
}
