"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Providers from "@/app/components/Providers";
import styles from "@/styles/Cart.module.css";
import CartSummary from "./CartSummary";
import Checkout from "../components/Checkout";
import OrderConfirmed from "../components/OrderConfirmed";

function _Cart() {
  const { onCheckout } = useSelector((state: RootState) => state.cartReducer);

  return (
    <div className={styles.cartContainer}>
      {onCheckout === "cart" && <CartSummary />}
      {onCheckout === "checkout" && <Checkout />}
      {onCheckout === "success" && <OrderConfirmed />}
    </div>
  );
}

export default function Cart() {
  return (
    <Providers>
      <_Cart />
    </Providers>
  );
}
