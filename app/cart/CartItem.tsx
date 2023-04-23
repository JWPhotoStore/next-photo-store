"use client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import styles from "@/styles/Cart.module.css";
import formatPrice from "@/util/PriceFormat";
import { CartItemTypes } from "@/types/CartItemTypes";
import {
  incrementQuantity,
  decrementQuantity,
  removeCartItem,
} from "@/app/store/cartSlice";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { CiTrash } from "react-icons/ci";

export default function CartItem({ cartItem }: { cartItem: CartItemTypes }) {
  const { id, name, image, unit_amount, quantity } = cartItem;
  const dispatch = useDispatch();

  return (
    <div className={styles.cartItemContainer} key={id}>
      <div className={styles.item}>
        <Image src={image} alt={name} width={40} height={40} />
        {/* TODO: Remove inline styling */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Quantity</h3>
          <h3>{quantity}</h3>
        </div>
        <div>
          <AiOutlineMinus
            onClick={() => dispatch(decrementQuantity(cartItem))}
          />
          <AiOutlinePlus
            onClick={() => dispatch(incrementQuantity(cartItem))}
          />
          <CiTrash onClick={() => dispatch(removeCartItem(cartItem))} />
        </div>
      </div>
      <h5>{formatPrice(unit_amount * quantity)}</h5>
    </div>
  );
}
