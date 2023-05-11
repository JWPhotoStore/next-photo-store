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
import Link from "next/link";

export default function CartItem({ cartItem }: { cartItem: CartItemType }) {
  const {
    name,
    image,
    unit_amount,
    quantity,
    description,
    currency,
    stripeProductId,
  } = cartItem;
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();

  const onDeleteCartItemClicked = async () => {
    try {
      await deleteCartItem(name).unwrap();
    } catch (err) {
      console.error("Failed to delete cart item: ", err);
    }
  };

  return (
    <div className={styles.cartItemContainer}>
      <Image src={image} alt={name} width={100} height={100} />
      <div className={styles.cartItemDetails}>
        <Link
          href={{
            pathname: `/product/${stripeProductId}`,
            query: {
              name,
              image,
              unit_amount,
              stripeProductId,
              description,
              currency,
            },
          }}
        >
          <h3>{name}</h3>
        </Link>
        <div className={styles.cartItemQuantity}>
          <span>Quantity: </span>
          <select
            value={quantity}
            onChange={(e) =>
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
