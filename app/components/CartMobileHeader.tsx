import React from "react";
import styles from "@/styles/Cart.module.css";
import { CartItemTypes } from "@/types/CartItemTypes";

export default function CartMobileHeader({
  cartItems,
}: {
  cartItems: CartItemTypes[];
}) {
  return <div className={styles.mobileHeaderContainer}></div>;
}
