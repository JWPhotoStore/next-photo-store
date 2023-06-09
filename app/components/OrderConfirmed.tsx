"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import stewie from "@/public/stewie.gif";
import styles from "@/styles/Cart.module.css";
import { useDispatch } from "react-redux";
import { setCheckout } from "../store/cartSlice";

export default function OrderConfirmed() {
  const dispatch = useDispatch();

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className={styles.orderConfirmedContainer}>
        <h1>Your order has been placed!</h1>
        <h2>Check your email for the receipt</h2>
        <Image src={stewie} alt="stewie" />
        <div>
          <Link href={"/dashboard"}>
            <button
              onClick={() => {
                dispatch(setCheckout("cart"));
              }}
            >
              Check your Order
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
