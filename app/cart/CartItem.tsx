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
import { CiTrash } from "react-icons/ci";

export default function CartItem({ cartItem }: { cartItem: CartItemTypes }) {
  const { id, name, image, unit_amount, quantity } = cartItem;
  const dispatch = useDispatch();

  return (
    <div className={styles.cartItemContainer} key={id}>
      <Image src={image} alt={name} width={150} height={150} />
      <div className={styles.cartItemDetails}>
        <h3>{name}</h3>
        <div>
          <span>Quantity: </span>
          <span>{quantity}</span>
        </div>
        <div className={styles.cartActionIcons}>
          <AiOutlineMinus
            onClick={() => dispatch(decrementQuantity(cartItem))}
          />
          <AiOutlinePlus
            onClick={() => dispatch(incrementQuantity(cartItem))}
          />
          <CiTrash onClick={() => dispatch(removeCartItem(cartItem))} />
        </div>
      </div>
      <div>
        <h3>{formatPrice(unit_amount * quantity)}</h3>
      </div>
    </div>
  );
}
