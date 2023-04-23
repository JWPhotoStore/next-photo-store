"use client";
import { useSelector } from "react-redux";
import styles from "@/styles/Cart.module.css";
import CartItem from "./CartItem";
import { CartItemTypes } from "@/types/CartItemTypes";

export default function CartItems({
  cartItems,
}: {
  cartItems: CartItemTypes[];
}) {
  return (
    <div className={styles.cartItemsContainer}>
      {cartItems.map((cartItem) => (
        <CartItem cartItem={cartItem} key={cartItem.id} />
      ))}
    </div>
  );
}
