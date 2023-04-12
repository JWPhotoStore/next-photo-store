"use client";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { isModuleBody } from "typescript";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const { cartItems, paymentIntent } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    //Create a payment intent as soon as the page loads up
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItems,
        payment_intent_id: paymentIntent,
      }),
    }).then((res) => {
      console.log(res);
      // SET CLIENT SECRET and the payment intent associated with it
    });
  }, []);

  return <div>Checkout</div>;
}
