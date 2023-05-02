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
      <h2>Shopping Cart</h2>
      {cartItems.map((cartItem, index) => (
        <CartItem cartItem={cartItem} key={index} />
      ))}
    </div>
  );
}
