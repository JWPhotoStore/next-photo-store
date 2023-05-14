import React from "react";
import styles from "@/styles/Cart.module.css";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import CartMobileHeader from "../components/CartMobileHeader";
import Link from "next/link";
import { useGetActiveOrderQuery } from "../store/apiSlice";
import { CartItemType } from "@/types/CartItemType";

export default function Cart() {
  const { data, isLoading } = useGetActiveOrderQuery();
  const cartItems: CartItemType[] | undefined = data?.cartItems;

  if (!isLoading && data && cartItems && cartItems.length === 0) {
    return (
      <div className={styles.emptyCartContainer}>
        <h2>Your cart is empty</h2>
        <button>
          {/* TODO: Button styling */}
          <Link href="/">Return to Shop</Link>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* TODO: This logic shows empty cart when initial load is in progress */}
      <div className={styles.cartContainer}>
        <CartMobileHeader cartItems={cartItems} />
        <CartItems cartItems={cartItems} />
        <CartSummary cartItems={cartItems} />
      </div>
    </>
  );
}
