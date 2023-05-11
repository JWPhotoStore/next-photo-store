"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import styles from "@/styles/Nav.module.css";
import Link from "next/link";
import { RiShoppingCartLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { setCheckout } from "../store/cartSlice";
import { setPaymentIntent } from "../store/stripeSlice";
import { useEffect } from "react";
import { openMobileMenu } from "../store/uiSlice";
import { useWindowSize } from "@/util/hooks";
import { useGetActiveOrderQuery } from "../store/apiSlice";
import { CartItemType } from "@/types/CartItemType";

export default function Nav({ user }: Session) {
  const { data, isError, isFetching, isSuccess, error } =
    useGetActiveOrderQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && data.paymentIntentId) {
      dispatch(setPaymentIntent(data.paymentIntentId));
    }

    if (isError) {
      console.error(error);
    }
  }, [isSuccess, isError]);

  const { width } = useWindowSize();
  const mobileBreakpoint = 640;

  const sumItemsAndQuantity = (cartItems: CartItemType[]) => {
    return cartItems.reduce((acc, cartItem) => {
      return acc + cartItem.quantity;
    }, 0);
  };

  let cartItemsLen: string | number = "";

  if (isFetching) {
    cartItemsLen = "";
  } else if (isSuccess && data.cartItems) {
    cartItemsLen =
      data.cartItems.length === 0 ? "" : sumItemsAndQuantity(data.cartItems);
  }

  return (
    <nav>
      <ul className={styles.navContentLeft}>
        {/* TODO: create new route for photos */}
        <Link href="/">prints</Link>
        <Link href="/contact">contact</Link>
      </ul>
      <Link href="/" onClick={() => dispatch(setCheckout("cart"))}>
        <h1>kushi photos</h1>
      </Link>
      <ul className={styles.navContentRight}>
        {width && width >= mobileBreakpoint && !user && (
          <li className={styles.authAction} onClick={() => signIn()}>
            <span>Sign in</span>
          </li>
        )}
        {user && (
          <Link href="/api/auth/signout">
            <li className={styles.authAction}>
              hello <span>{user.name}</span>
            </li>
          </Link>
        )}
        <Link href="/cart" onClick={() => dispatch(setCheckout("cart"))}>
          <li className={styles.cartIcon}>
            <RiShoppingCartLine size={25} />
            {cartItemsLen}
          </li>
        </Link>
        {width && width < mobileBreakpoint && (
          <div
            className={styles.mobileMenuIcon}
            onClick={() => dispatch(openMobileMenu())}
          >
            =
          </div>
        )}
      </ul>
    </nav>
  );
}
