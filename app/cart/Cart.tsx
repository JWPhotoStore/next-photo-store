import React, { useEffect, useState } from "react";
import styles from "@/styles/Cart.module.css";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import CartMobileHeader from "../components/CartMobileHeader";
import Link from "next/link";
import {
  useGetActiveOrderQuery,
  useAddCartItemsLSMutation,
} from "../store/apiSlice";
import { useSession } from "next-auth/react";
import { getCartItemsLS, clearLocalStorage } from "@/util/cart-item-utils";
import { CartItemType } from "@/types/CartItemType";

export default function Cart() {
  const { data, isLoading, isFetching, isSuccess } = useGetActiveOrderQuery();
  const [addCartItems] = useAddCartItemsLSMutation();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const session = useSession();

  useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "authenticated") {
      if (data?.cartItems) {
        setCartItems(data.cartItems);
      }
    }
    if (session.status === "unauthenticated") {
      const cartItemsLS = getCartItemsLS();
      setCartItems(cartItemsLS);

      const renderCartItemsLS = () => {
        const cartItemsLS = getCartItemsLS();
        setCartItems(cartItemsLS);
      };

      window.addEventListener("cartItemLocalStorage", renderCartItemsLS);
      return () =>
        window.removeEventListener("cartItemLocalStorage", renderCartItemsLS);
    }
  }, [session.status, isFetching, isSuccess]);

  return (
    <>
      {!isLoading && cartItems && cartItems.length > 0 ? (
        <div className={styles.cartContainer}>
          <CartMobileHeader cartItems={cartItems} />
          <CartItems cartItems={cartItems} />
          <CartSummary cartItems={cartItems} />
        </div>
      ) : (
        <div className={styles.emptyCartContainer}>
          <h2>Your cart is empty</h2>
          <button>
            {/* TODO: Button styling */}
            <Link href="/">Return to Shop</Link>
          </button>
        </div>
      )}
    </>
  );
}
