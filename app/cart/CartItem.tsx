"use client";
import Image from "next/image";
import styles from "@/styles/Cart.module.css";
import { formatPrice } from "@/util/PriceFormat";
import { CartItemBareType, CartItemType } from "@/types/CartItemType";
import { useUpdateCartItemMutation } from "../store/apiSlice";
import Link from "next/link";
import DeleteItem from "../components/DeleteCartItem";
import { useSession } from "next-auth/react";
import { updateCartItemInLocalStorage } from "@/util/cart-item-utils";

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
  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();
  const { status } = useSession();

  const handleUpdate = async (e: React.SyntheticEvent) => {
    const cartItem: CartItemBareType = {
      name,
      unit_amount,
      quantity: parseInt(e.target.value),
    };
    try {
      if (status === "unauthenticated") updateCartItemInLocalStorage(cartItem);
      if (status === "authenticated") await updateCartItem(cartItem).unwrap();
    } catch (err) {
      console.error("Failed to update cart quantity: ", err);
    }
  };

  return (
    <>
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
            onChange={(e: React.SyntheticEvent) => handleUpdate(e)}
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
        <DeleteItem itemToDelete={name} />
        <p>{formatPrice(unit_amount * quantity)}</p>
      </div>
    </>
  );
}
