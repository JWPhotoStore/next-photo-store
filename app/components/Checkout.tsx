"use client";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import CheckoutForm from "./CheckoutForm";
import { setCheckout } from "../store/cartSlice";
import styles from "@/styles/Cart.module.css";
import Link from "next/link";
import { IoReturnUpBackSharp } from "react-icons/io5";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const { clientSecret } = useSelector(
    (state: RootState) => state.stripeReducer
  );
  const dispatch = useDispatch();

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  return (
    <div className={styles.checkoutContainer}>
      <Link href="/cart">
        <span
          className={styles.backToCart}
          onClick={() => dispatch(setCheckout("cart"))}
        >
          <IoReturnUpBackSharp /> Back to Store
        </span>
      </Link>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}
