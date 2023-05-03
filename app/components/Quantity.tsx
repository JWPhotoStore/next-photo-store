"use client";

import { useState } from "react";
import AddToCart_new from "./AddToCart_new";
import { ProductType } from "@/types/ProductType";

type QuantityType = {
  details: ProductType;
};

export default function Quantity({ details }: QuantityType) {
  const [quantity, setQuantity] = useState(1);
  const quantityOptions = [1, 2, 3, 4, 5];

  return (
    <div>
      <span>Quantity: </span>
      <select
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      >
        {quantityOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div>
        <AddToCart_new {...details} quantity={quantity} />
      </div>
    </div>
  );
}
