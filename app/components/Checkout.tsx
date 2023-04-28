"use client";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";
import { setPaymentIntent } from "../store/cartSlice";
import CheckoutForm from "./CheckoutForm";
import { PaymentIntentResType } from "@/types/PaymentIntentResType";
import { setCheckout } from "../store/cartSlice";
import styles from "@/styles/Cart.module.css";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const { cartItems, paymentIntent } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const dispatch = useDispatch();
  const router = useRouter();
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
    })
      .then((res) => {
        if (res.status === 403) {
          return router.push("/api/auth/signin");
        }
        return res.json();
      })
      .then((data: PaymentIntentResType) => {
        // SET CLIENT SECRET and the payment intent associated with it
        setClientSecret(data.client_secret);
        dispatch(setPaymentIntent(data.id));
      });
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  return (
    <div>
      <Link href="/cart">
        <span onClick={() => dispatch(setCheckout("cart"))}>Back to Store</span>
      </Link>
      {clientSecret && (
        <div>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </div>
      )}
    </div>
  );
}
