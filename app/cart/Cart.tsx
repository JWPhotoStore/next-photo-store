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
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Cart() {
  const { data, isLoading, isFetching, isSuccess } = useGetActiveOrderQuery();
  const [addCartItems] = useAddCartItemsLSMutation();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const session = useSession();
  const { paymentIntentId } = useSelector(
    (state: RootState) => state.stripeReducer
  );

  useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "authenticated") {
      if (isSuccess && data?.cartItems) {
        const cartItemsLS = getCartItemsLS();

        // Add the LS items to Database
        if (cartItemsLS.length !== 0) {
          try {
            // Validate if it makes sense to delete cartItems from local storage first or use mutation
            addCartItems({ cartItemsLS, paymentIntentId });
            clearLocalStorage();
          } catch (err) {
            if (err) console.error(err);
          }
        }

        // const allCartItems = data.cartItems.concat(cartItemsLS);
        // setCartItems(allCartItems);

        // setCartItems(data.cartItems);
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
      {/* TODO: This logic shows empty cart when initial load is in progress */}
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
