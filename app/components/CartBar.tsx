"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Image from "next/image";
import styles from "@/styles/CartItem.module.css";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";

// Need to set isOpen back to false whenever I click back to home page or back
export default function CartContainer() {
  const { isOpen, cartItems } = useSelector(
    (state: RootState) => state.cartReducer
  );

  return (
    <>
      {isOpen && (
        <div className={styles.cartContainer}>
          <CartItems />
          {cartItems.length > 0 && <CartSummary cartItems={cartItems} />}
        </div>
      )}
    </>
  );
}
