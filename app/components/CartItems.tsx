"use client";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import styles from "@/styles/CartItem.module.css";
// import formatPrice from "@/util/PriceFormat";
// import { decrementQuantity, incrementQuantity } from "../store/cartSlice";
// import { useState, useEffect } from "react";
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
