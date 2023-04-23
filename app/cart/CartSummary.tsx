"use client";
import { CartItemTypes } from "@/types/CartItemTypes";
import formatPrice from "@/util/PriceFormat";
import { useDispatch } from "react-redux";
import { setCheckout } from "../store/cartSlice";
import styles from "@/styles/Cart.module.css";

export default function CartSummary({
  cartItems,
}: {
  cartItems: CartItemTypes[];
}) {
  const dispatch = useDispatch();

  const calculateSum = () => {
    return cartItems.reduce((acc: number, item: CartItemTypes) => {
      return acc + item.unit_amount * item.quantity;
    }, 0);
  };

  return (
    <div className={styles.cartSummaryContainer}>
      <h2>Summary</h2>
      <div>
        <p>Total: {formatPrice(calculateSum())}</p>
      </div>
      <button
        className={styles.primaryButton}
        onClick={() => dispatch(setCheckout("checkout"))}
      >
        Checkout
      </button>
    </div>
  );
}
