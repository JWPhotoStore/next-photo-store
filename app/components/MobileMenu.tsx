"use client";

import { signIn } from "next-auth/react";
import styles from "@/styles/MobileMenu.module.css";
import { Session } from "next-auth";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { closeMobileMenu } from "../store/uiSlice";
import Link from "next/link";
import { motion } from "framer-motion";
import { TfiClose } from "react-icons/tfi";

export default function MobileMenu({ user }: Session) {
  const dispatch = useDispatch();
  const { isMobileMenuOpen } = useSelector(
    (state: RootState) => state.uiReducer
  );

  const closeMenuWithDelay = () => {
    setTimeout(() => dispatch(closeMobileMenu()), 250);
  };

  return (
    <>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.1 }}
          className={styles.mobileMenuContainer}
        >
          <div className={styles.mobileHeaderContainer}>
            {user ? (
              <span className={styles.authAction}>
                hello <span>{user.name}</span>
              </span>
            ) : (
              ""
            )}
            <span onClick={() => dispatch(closeMobileMenu())}>
              <TfiClose />
            </span>
          </div>
          <div className={styles.linksContainer}>
            <Link href="/" onClick={closeMenuWithDelay}>
              <span>Prints</span>
            </Link>
            <Link href="/cart" onClick={closeMenuWithDelay}>
              Cart
            </Link>
            <Link href="/contact" onClick={closeMenuWithDelay}>
              Contact
            </Link>
            {user ? (
              <Link href="/api/auth/signout">
                <span className={styles.authAction}>
                  <span>Sign Out</span>
                </span>
              </Link>
            ) : (
              <span className={styles.authAction} onClick={() => signIn()}>
                <span className={styles.signInLink}>Sign in</span>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
