"use client";

import styles from "@/styles/Cart.module.css";
import CartItem from "./CartItem";
import { CartItemType } from "@/types/CartItemType";
import { motion, AnimatePresence } from "framer-motion";

export default function CartItems({
  cartItems,
}: {
  cartItems: CartItemType[];
}) {
  return (
    <div className={styles.cartItemsContainer}>
      <h2>Shopping Cart</h2>
      <AnimatePresence>
        {/* TODO: Re-renders on cartItems are buggy */}
        {cartItems.map((cartItem, index) => (
          <motion.div
            key={`${cartItem.name}${index}`}
            exit={{ opacity: 0 }}
            className={styles.cartItemContainer}
          >
            <CartItem cartItem={cartItem} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
