"use client";
import { CartItemTypes } from "@/types/CartItemTypes";
import formatPrice from "@/util/PriceFormat";

export default function CartSummary({
  cartItems,
}: {
  cartItems: CartItemTypes[];
}) {
  const calculateSum = () => {
    return cartItems.reduce((acc: number, item: CartItemTypes) => {
      return acc + item.unit_amount * item.quantity;
    }, 0);
  };

  return (
    <div>
      <p>Total: {formatPrice(calculateSum())}</p>
    </div>
  );
}
