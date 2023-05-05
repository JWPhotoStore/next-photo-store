"use client";
import Image from "next/image";
import styles from "@/styles/Cart.module.css";
import { formatPrice } from "@/util/PriceFormat";
import { CartItemType } from "@/types/CartItemType";
import { CgClose } from "react-icons/cg";
import {
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "../store/apiSlice";

export default function CartItem({ cartItem }: { cartItem: CartItemType }) {
  const { name, image, unit_amount, quantity } = cartItem;
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();

  const onDeleteCartItemClicked = async () => {
    try {
      await deleteCartItem({ name, unit_amount, quantity }).unwrap();
    } catch (err) {
      console.error("Failed to delete cart item: ", err);
    }
  };

  return (
    <div className={styles.cartItemContainer}>
      <Image src={image} alt={name} width={100} height={100} />
      <div className={styles.cartItemDetails}>
        <h3>{name}</h3>
        <div className={styles.cartItemQuantity}>
          {/* <AiOutlineMinus
              className={styles.cartActionIcons}
              onClick={() => dispatch(decrementQuantity(cartItem))}
            />
            <span>{quantity}</span>
            <AiOutlinePlus
              className={styles.cartActionIcons}
              onClick={() => dispatch(incrementQuantity(cartItem))}
            /> */}
          <span>Quantity: </span>
          <select
            value={quantity}
            onChange={(e: React.SyntheticEvent) =>
              updateCartItem({
                name,
                unit_amount,
                quantity: parseInt(e.target.value),
              }).unwrap()
            }
            disabled={isLoading}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.cartItemPrice}>
        <CgClose onClick={() => onDeleteCartItemClicked()} />
        <p>{formatPrice(unit_amount * quantity)}</p>
      </div>
    </div>
  );
}
