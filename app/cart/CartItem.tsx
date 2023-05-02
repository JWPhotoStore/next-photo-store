"use client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import styles from "@/styles/Cart.module.css";
import { formatPrice } from "@/util/PriceFormat";
import { CartItemTypes } from "@/types/CartItemTypes";
import {
  incrementQuantity,
  decrementQuantity,
  removeCartItem,
} from "@/app/store/cartSlice";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { CgClose } from "react-icons/cg";

export default function CartItem({ cartItem }: { cartItem: CartItemTypes }) {
  const { id, name, image, unit_amount, quantity } = cartItem;
  const dispatch = useDispatch();

  return (
    <div className={styles.cartItemContainer} key={id}>
      <Image src={image} alt={name} width={100} height={100} />
      <div className={styles.cartItemDetails}>
        <h3>{name}</h3>
        <div className={styles.cartItemQuantity}>
          <AiOutlineMinus
            className={styles.cartActionIcons}
            onClick={() => dispatch(decrementQuantity(cartItem))}
          />
          <span>{quantity}</span>
          <AiOutlinePlus
            className={styles.cartActionIcons}
            onClick={() => dispatch(incrementQuantity(cartItem))}
          />
        </div>
      </div>
      <div className={styles.cartItemPrice}>
        <CgClose onClick={() => dispatch(removeCartItem(cartItem))} />
        <p>{formatPrice(unit_amount * quantity)}</p>
      </div>
    </div>
  );
}
