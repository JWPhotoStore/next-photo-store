"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import styles from "@/styles/Nav.module.css";
import Link from "next/link";
import { RiShoppingCartLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setCheckout } from "../store/cartSlice";
import { openMobileMenu } from "../store/uiSlice";
import { useWindowSize } from "@/util/hooks";

export default function Nav({ user }: Session) {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  const dispatch = useDispatch();

  const { width } = useWindowSize();
  const mobileBreakpoint = 640;

  return (
    <nav>
<<<<<<< HEAD
      <div className={styles.navContentContainer}>
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
      </div>
=======
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
          <li className={styles.authAction}>
            <Link href="/api/auth/signout">
              hello <span>{user.name}</span>
            </Link>
          </li>
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
>>>>>>> 9991800 (auth action ui fix)
    </nav>
  );
}
