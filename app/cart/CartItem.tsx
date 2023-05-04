"use client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import styles from "@/styles/Cart.module.css";
import { formatPrice } from "@/util/PriceFormat";
import { CartItemType } from "@/types/CartItemType";
import { incrementQuantity, decrementQuantity } from "@/app/store/cartSlice";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { useDeleteCartItemMutation } from "../store/apiSlice";

export default function CartItem({ cartItem }: { cartItem: CartItemType }) {
  const { id, name, image, unit_amount, quantity } = cartItem;
  const dispatch = useDispatch();
  const [deleteCartItem, { isLoading }] = useDeleteCartItemMutation();

  const onDeleteCartItemClicked = async () => {
    try {
      await deleteCartItem(name).unwrap();
    } catch (err) {
      console.error("Failed to delete cart item: ", err);
    }
  };

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
        <CgClose onClick={() => onDeleteCartItemClicked()} />
        <p>{formatPrice(unit_amount * quantity)}</p>
      </div>
    </div>
  );
}
