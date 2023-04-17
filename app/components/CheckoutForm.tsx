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
import formatPrice from "@/util/PriceFormat";

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
      })
      .then((result) => {
        if (!result.error) {
          dispatch(setCheckout("success"));
        }
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
            {isLoading ? <span>Processing</span> : <span>Pay now</span>}
          </span>
        </button>
      </form>
    </div>
  );
}
