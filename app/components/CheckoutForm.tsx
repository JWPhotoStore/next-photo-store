"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setCheckout } from "../store/cartSlice";
import { formatPrice, calculateOrderAmount } from "@/util/PriceFormat";
import styles from "@/styles/Cart.module.css";
import { useGetActiveOrderQuery } from "../store/apiSlice";

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { data, isSuccess } = useGetActiveOrderQuery();

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    if (isSuccess && data.cartItems)
      setTotalPrice(calculateOrderAmount(data.cartItems));
  }, [stripe, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
        //TODO: fix this redirect link
        // confirmParams: {
        //   return_url: "http://localhost:3000/success",
        // },
      })
      .then((result) => {
        if (!result.error) {
          //send a RDK query to webhooks to invalidate cartItems (fetch-active-orders) then send to OrderConfirmed page
          // Within that component, setpaymentIntent back to an empty string
          dispatch(setCheckout("success"));
        } else {
          // TODO: validate how to handle errors
          throw Error(result.error.message);
        }
        setIsLoading(false);
      })
      // TODO: validate how to handle errors
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      <form
        className={styles.checkoutForm}
        onSubmit={handleSubmit}
        id="payment-form"
      >
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        <h2>Total: {formatPrice(totalPrice)}</h2>
        <button
          className={styles.checkoutFormSubmit}
          id="submit"
          disabled={isLoading || !stripe || !elements}
        >
          <span id="button=text">
            {isLoading ? <span>Processing</span> : <span>Place Order</span>}
          </span>
        </button>
      </form>
    </>
  );
}
