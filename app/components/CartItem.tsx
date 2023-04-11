"use client";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import styles from "@/styles/CartItem.module.css";
import formatPrice from "@/util/PriceFormat";
import { CartItemTypes } from "@/types/CartItemTypes";
import { useState } from "react";
import { incrementQuantity, decrementQuantity } from "../store/cartSlice";

export default function CartItem({ cartItem }: { cartItem: CartItemTypes }) {
  // const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const { id, name, image, unit_amount, quantity } = cartItem;
  const dispatch = useDispatch();

  return (
    <div className={styles.cartItem} key={id}>
      <div className={styles.item}>
        <Image src={image} alt={name} width={40} height={40} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Quantity</h3>
          <h3>{quantity}</h3>
        </div>
        <div>
          <button onClick={() => dispatch(decrementQuantity(cartItem))}>
            -
          </button>
          <button onClick={() => dispatch(incrementQuantity(cartItem))}>
            +
          </button>
        </div>
      </div>
      {unit_amount && (
        <h5>{formatPrice(String(Number(unit_amount) * quantity))}</h5>
      )}
      {/* {unit_amount && <h5>{Number(formatPrice(unit_amount)) * quantity}</h5>} */}
    </div>
  );
}
