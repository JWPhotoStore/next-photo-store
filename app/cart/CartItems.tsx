"use client";

import styles from "@/styles/Cart.module.css";
import CartItem from "./CartItem";
import { CartItemType } from "@/types/CartItemType";

export default function CartItems({
  cartItems,
}: {
  cartItems: CartItemType[];
}) {
  return (
    <div className={styles.cartItemsContainer}>
      <h2>Shopping Cart</h2>
      {cartItems.map((cartItem, index) => (
        <CartItem cartItem={cartItem} key={`${cartItem.name}${index}`} />
      ))}
    </div>
  );
}
