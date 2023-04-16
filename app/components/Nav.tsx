"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import styles from "@/styles/Nav.module.css";
import Link from "next/link";
import { AiFillShopping } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../store/cartSlice";
import { RootState } from "../store/store";

export default function Nav({ user }: Session) {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContentContainer}>
        <Link href="/">
          <h1>Styled</h1>
        </Link>
        <ul className={styles.navContentRight}>
          <li className={styles.cartIcon}>
            <AiFillShopping onClick={() => dispatch(toggleCart())} />
          </li>
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
                <Image
                  //TODO: Add a default image if the user doesn't have one
                  src={user?.image as string}
                  alt={user.name as string}
                  width={48}
                  height={48}
                  className={styles.image}
                />
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
