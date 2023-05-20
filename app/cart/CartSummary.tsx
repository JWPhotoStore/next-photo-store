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
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

export default function CartSummary({
  cartItems,
}: {
  cartItems: CartItemType[];
}) {
  const { data, isSuccess, isLoading, isError, error } =
    useGetClientSecretQuery();
  const dispatch = useDispatch();
  const session = useSession();

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
      {session.data?.user ? (
        <button
          onClick={() => dispatch(setCheckout("checkout"))}
          disabled={isLoading}
        >
          Checkout
        </button>
      ) : (
        <button onClick={() => signIn()} disabled={isLoading}>
          Sign in to Checkout
        </button>
      )}
    </div>
  );
}
