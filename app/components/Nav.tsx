"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import styles from "@/styles/Nav.module.css";
import Link from "next/link";
import { RiShoppingCartLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setCheckout, setPaymentIntent, updateCart } from "../store/cartSlice";
import { useEffect } from "react";
import { openMobileMenu } from "../store/uiSlice";
import { useWindowSize } from "@/util/hooks";

export default function Nav({ user }: Session) {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  const dispatch = useDispatch();

  //Fetch current user's paymentIntent and cart Items
  useEffect(() => {
    fetch("api/fetch-payment-intent")
      .then((res) => res.json())
      .then((data) => {
        if (data.paymentIntentID) {
          dispatch(setPaymentIntent(data.paymentIntentID));

          //TODO: only doing this map to temporarily meet cartItem type - discuss to change
          const allItems = data.products.map((product) => {
            return { ...product, currency: data.currency };
          });
          dispatch(updateCart(allItems));
        }
      });
  }, []);
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
        <h1>will ku photos</h1>
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
        <Link href="/cart">
          <li className={styles.cartIcon}>
            <RiShoppingCartLine size={25} />
            {cartItems.length}
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
