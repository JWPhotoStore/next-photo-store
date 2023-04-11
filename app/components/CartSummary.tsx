"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
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
      <p>Total</p>
      <p>
        {/* {cartItems.reduce((acc: number, item: CartItemTypes) => {
          return acc + Number(formatPrice(item.unit_amount * item.quantity));
        }, 0)} */}
        {formatPrice(calculateSum())}
      </p>
    </div>
  );
}
