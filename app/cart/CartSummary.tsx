"use client";
import { CartItemType } from "@/types/CartItemType";
import { formatPrice } from "@/util/PriceFormat";
import { useDispatch } from "react-redux";
import { setCheckout } from "../store/cartSlice";
import styles from "@/styles/Cart.module.css";
import { useGetClientSecretQuery } from "../store/apiSlice";
import { useEffect } from "react";
import { setClientSecret } from "../store/stripeSlice";
import { calculateOrderAmount } from "@/util/PriceFormat";

export default function CartSummary({
  cartItems,
}: {
  cartItems: CartItemType[];
}) {
  const { data, isSuccess, isLoading, isError, error } =
    useGetClientSecretQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && data.clientSecret) {
      dispatch(setClientSecret(data.clientSecret));
    }

    if (isError) {
      console.log(error);
    }
  }, [isSuccess, isError, data]);

  return (
    <div className={styles.cartSummaryContainer}>
      <h2>Summary</h2>
      <div className={styles.inlinePriceContainer}>
        <h3>Subtotal: </h3>
        <h3>{formatPrice(calculateOrderAmount(cartItems))}</h3>
      </div>
      <button
        onClick={() => dispatch(setCheckout("checkout"))}
        disabled={isLoading}
      >
        Checkout
      </button>
    </div>
  );
}
