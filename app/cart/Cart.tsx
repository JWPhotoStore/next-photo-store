import React from "react";
import styles from "@/styles/Cart.module.css";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import CartMobileHeader from "../components/CartMobileHeader";
import Link from "next/link";
import { useGetActiveOrderQuery } from "../store/apiSlice";

export default function Cart() {
  const { data, isLoading } = useGetActiveOrderQuery();

  return (
    <>
      {/* TODO: This logic shows empty cart when initial load is in progress */}
      {!isLoading && data && data.cartItems.length > 0 ? (
        <div className={styles.cartContainer}>
          <CartMobileHeader cartItems={data.cartItems} />
          <CartItems cartItems={data.cartItems} />
          <CartSummary cartItems={data.cartItems} />
        </div>
      ) : (
        <div className={styles.emptyCartContainer}>
          <h2>Your cart is empty</h2>
          <button>
            {/* TODO: Button styling */}
            <Link href="/">Return to Shop</Link>
          </button>
        </div>
      )}
    </>
  );
}
