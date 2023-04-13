"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import styles from "@/styles/CartItem.module.css";
import CartItem from "./CartItem";

export default function CartItems() {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  return (
    <div className={styles.cartItemsContainer}>
      {cartItems.map((cartItem) => (
        <CartItem cartItem={cartItem} key={cartItem.id} />
      ))}
    </div>
  );
}
