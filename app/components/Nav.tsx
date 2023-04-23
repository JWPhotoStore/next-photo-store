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
