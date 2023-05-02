"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
// import Image from "next/image";
import styles from "@/styles/Nav.module.css";
import Link from "next/link";
import { RiShoppingCartLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
// import { toggleCart } from "../store/cartSlice";
import { RootState } from "../store/store";
import { setCheckout, setPaymentIntent, updateCart } from "../store/cartSlice";
import { useEffect } from "react";

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

  return (
    <nav>
      <div className={styles.navContentContainer}>
        <ul className={styles.navContentLeft}>
          {/* TODO: create new route for photos */}
          <Link href="/">photos</Link>
          <Link href="/contact">contact</Link>
        </ul>
        <Link href="/" onClick={() => dispatch(setCheckout("cart"))}>
          <h1>PlaceholderForTitle</h1>
        </Link>
        <ul className={styles.navContentRight}>
          {!user && (
            <li className={styles.signIn}>
              <button className={styles.button} onClick={() => signIn()}>
                Sign in
              </button>
            </li>
          )}
          {user && (
            <>
              <li>
                {/* <Image
                  //TODO: Add a default image if the user doesn't have one
                  src={user?.image as string}
                  alt={user.name as string}
                  width={48}
                  height={48}
                  className={styles.image}
                /> */}
                hello <span>{user.name}</span>
              </li>
            </>
          )}
          <Link href="/cart">
            <li className={styles.cartIcon}>
              <RiShoppingCartLine
                size={25}
                // onClick={() => dispatch(toggleCart())}
              />
              {cartItems.length}
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}
