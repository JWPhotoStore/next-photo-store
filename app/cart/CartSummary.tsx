"use client";
import { CartItemType } from "@/types/CartItemType";
import { formatPrice } from "@/util/PriceFormat";
import { useDispatch } from "react-redux";
import { setCheckout } from "../store/cartSlice";
import styles from "@/styles/Cart.module.css";
import {
  useGetClientSecretQuery,
  useGetActiveOrderQuery,
} from "../store/apiSlice";
import { useEffect } from "react";
import { setClientSecret } from "../store/stripeSlice";
import { BeatLoader } from "react-spinners";

export default function CartSummary({
  cartItems,
}: {
  cartItems: CartItemType[];
}) {
  const { data, isSuccess, isError, error } = useGetClientSecretQuery();
  const { isLoading, isFetching } = useGetActiveOrderQuery();
  const dispatch = useDispatch();

  const calculateSum = () => {
    return cartItems.reduce((acc: number, item: CartItemType) => {
      return acc + item.unit_amount * item.quantity;
    }, 0);
  };

  useEffect(() => {
    if (isSuccess && data.clientSecret) {
      dispatch(setClientSecret(data.clientSecret));
    }

    if (isError) {
      console.error(error);
    }
  }, [isSuccess, isError, data]);

  return (
    <div className={styles.cartSummaryContainer}>
      <h2>Summary</h2>
      <div className={styles.inlinePriceContainer}>
        <h3>Subtotal: </h3>
        <h3>
          {isLoading || isFetching ? (
            <BeatLoader size={6} />
          ) : (
            formatPrice(calculateSum())
          )}
        </h3>
      </div>
      <button onClick={() => dispatch(setCheckout("checkout"))}>
        Checkout
      </button>
    </div>
  );
}
