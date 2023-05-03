import React from "react";
import styles from "@/styles/Cart.module.css";
import { CartItemType } from "@/types/CartItemType";

export default function CartMobileHeader({
  cartItems,
}: {
  cartItems: CartItemType[];
}) {
  return <div className={styles.mobileHeaderContainer}></div>;
}
