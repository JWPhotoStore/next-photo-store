"use client";

import styles from "@/styles/Cart.module.css";
import CartItem from "./CartItem";
import { CartItemType } from "@/types/CartItemType";
import { motion, AnimatePresence } from "framer-motion";
import { useGetActiveOrderQuery } from "../store/apiSlice";
import { RotateLoader } from "react-spinners";

export default function CartItems({
  cartItems,
}: {
  cartItems: CartItemType[];
}) {
  const { isLoading, isFetching } = useGetActiveOrderQuery();

  return (
    <div className={styles.cartItemsContainer}>
      <h2>Shopping Cart</h2>
      {isLoading || isFetching ? (
        <div className={styles.cartLoaderContainer}>
          <RotateLoader />
        </div>
      ) : (
        <AnimatePresence>
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
      )}
    </div>
  );
}
