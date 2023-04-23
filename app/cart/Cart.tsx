import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import styles from "@/styles/Cart.module.css";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";

export default function Cart() {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  return (
    <>
      {cartItems.length > 0 ? (
        <div className={styles.cartSummaryContainer}>
          <CartItems cartItems={cartItems} />
          <CartSummary cartItems={cartItems} />
        </div>
      ) : (
        <div>
          <h1>Your cart is empty</h1>
        </div>
      )}
    </>
  );
}
