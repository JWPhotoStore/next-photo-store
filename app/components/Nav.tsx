"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import styles from "@/styles/Nav.module.css";
import Link from "next/link";
import { RiShoppingCartLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { setCheckout, updateCart } from "../store/cartSlice";
import { setPaymentIntent } from "../store/stripeSlice";
import { useEffect } from "react";
import { openMobileMenu } from "../store/uiSlice";
import { useWindowSize } from "@/util/hooks";
import { useGetActiveOrderQuery } from "../store/apiSlice";

export default function Nav({ user }: Session) {
  const { data, isError, isLoading, isSuccess, error } =
    useGetActiveOrderQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && data.paymentIntentID) {
      dispatch(setPaymentIntent(data.paymentIntentID));
    }

    if (isError) {
      console.error(error);
    }
  }, [isSuccess, isError]);

  const { width } = useWindowSize();
  const mobileBreakpoint = 640;

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
            {/* TODO: Fix this hack. Guest users don't have cartItems so would cause app to crash. Doesn't rerender correctly*/}
            {/* {!isLoading && data?.cartItems ? data.cartItems.length : ""} */}
            {!isLoading && data?.cartItems
              ? data.cartItems.reduce((acc, cart) => {
                  return acc + cart.quantity;
                }, 0)
              : ""}
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
