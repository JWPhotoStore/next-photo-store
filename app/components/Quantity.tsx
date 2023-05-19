"use client";

import { useState } from "react";
import AddToCart from "./AddToCart";
import { ProductType } from "@/types/ProductType";
import { SessionProvider } from "next-auth/react";

type QuantityType = {
  details: ProductType;
};

export default function Quantity({ details }: QuantityType) {
  const [quantity, setQuantity] = useState(1);
  const quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
      <SessionProvider>
        <AddToCart {...details} quantity={quantity} />
      </SessionProvider>
    </div>
  );
}
