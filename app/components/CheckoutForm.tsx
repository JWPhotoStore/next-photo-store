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
import { setClientSecret, setPaymentIntent } from "../store/stripeSlice";
import { formatPrice, calculateOrderAmount } from "@/util/PriceFormat";
import styles from "@/styles/Cart.module.css";
import {
  useGetActiveOrderQuery,
  useConfirmPaymentMutation,
} from "../store/apiSlice";

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { paymentIntentId } = useSelector(
    (state: RootState) => state.stripeReducer
  );
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { data, isSuccess } = useGetActiveOrderQuery();
  const [confirmPayment] = useConfirmPaymentMutation();

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
          //TODO: Figure out how to get our webhook to send a response back to the client before we render the confirmation page
          setTimeout(() => {
            confirmPayment(paymentIntentId)
              .unwrap()
              .then((res) => {
                if (res.orderComplete) {
                  dispatch(setClientSecret(""));
                  dispatch(setPaymentIntent(""));
                  dispatch(setCheckout("success"));
                  setIsLoading(false);
                }
              });
          }, 1000);
        } else {
          // TODO: validate how to handle errors
          throw Error(result.error.message);
        }
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
