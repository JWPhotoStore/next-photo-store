"use client";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";
import { setPaymentIntent, setClientSecret } from "../store/stripeSlice";
import CheckoutForm from "./CheckoutForm";
import { PaymentIntentResType } from "@/types/PaymentIntentResType";
import { setCheckout } from "../store/cartSlice";
import styles from "@/styles/Cart.module.css";
import Link from "next/link";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useGetActiveOrderQuery } from "../store/apiSlice";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const { data, isSuccess } = useGetActiveOrderQuery();

  const { clientSecret, paymentIntentId } = useSelector(
    (state: RootState) => state.stripeReducer
  );

  const dispatch = useDispatch();
  const router = useRouter();

  // useEffect(() => {
  //   //Create a payment intent as soon as the page loads up
  //   if (isSuccess) {
  //     fetch("/api/update-stripe", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         // items: data.cartItems,
  //         paymentIntentId,
  //       }),
  //     })
  //       .then((res) => {
  //         if (res.status === 403) {
  //           return router.push("/api/auth/signin");
  //         }
  //         return res.json();
  //       })
  //       .then((data: PaymentIntentResType) => {
  //         // SET CLIENT SECRET and the payment intent associated with it
  //         dispatch(setClientSecret(data.client_secret));
  //         // dispatch(setPaymentIntent(data.id));
  //       });
  //   }
  // }, [isSuccess]);

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
