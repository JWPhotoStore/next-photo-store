"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
// import Image from "next/image";
import styles from "@/styles/Nav.module.css";
import Link from "next/link";
import { RiShoppingCartLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setCheckout } from "../store/cartSlice";

export default function Nav({ user }: Session) {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();

  return (
    <nav>
      <div className={styles.navContentContainer}>
        <ul className={styles.navContentLeft}>
          {/* TODO: create new route for photos */}
          <Link href="/">photos</Link>
          <Link href="/contact">contact</Link>
        </ul>
        <Link href="/" onClick={() => dispatch(setCheckout("cart"))}>
          <h1>will ku photos</h1>
        </Link>
        <ul className={styles.navContentRight}>
          {!user && (
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
        </ul>
      </div>
    </nav>
  );
}
