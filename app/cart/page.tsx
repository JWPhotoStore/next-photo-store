"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Providers from "@/app/components/Providers";
import styles from "@/styles/Cart.module.css";
import Cart from "./Cart";
import Checkout from "../components/Checkout";
import OrderConfirmed from "../components/OrderConfirmed";
import { SessionProvider } from "next-auth/react";

function _CartPage() {
  const { onCheckout } = useSelector((state: RootState) => state.cartReducer);

  return (
    <SessionProvider>
      <div className={styles.cartPageContainer}>
        {onCheckout === "cart" && <Cart />}
        {onCheckout === "checkout" && <Checkout />}
        {onCheckout === "success" && <OrderConfirmed />}
      </div>
    </SessionProvider>
  );
}

export default function CartPage() {
  return (
    <Providers>
      <_CartPage />
    </Providers>
  );
}
