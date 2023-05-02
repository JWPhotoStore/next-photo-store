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
import { formatPrice } from "@/util/PriceFormat";
import styles from "@/styles/Cart.module.css";

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  // TODO - can include this function in our util folder
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.unit_amount * item.quantity;
  }, 0);

  const formattedPrice = formatPrice(totalPrice);

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }
  }, [stripe]);

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
    <div>
      <form onSubmit={handleSubmit} id="payment-form">
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        <h1>Total: {formattedPrice}</h1>
        <button id="submit" disabled={isLoading || !stripe || !elements}>
          <span id="button=text">
            {isLoading ? <span>Processing</span> : <span>Place Order</span>}
          </span>
        </button>
      </form>
    </div>
  );
}
