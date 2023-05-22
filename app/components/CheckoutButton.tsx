import React from "react";
import { useDispatch } from "react-redux";
import { setCheckout } from "../store/cartSlice";
import { useGetClientSecretQuery } from "../store/apiSlice";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { features } from "../../util/feature-flags";

export default function CheckoutButton() {
  const { isSuccess, isLoading } = useGetClientSecretQuery();
  const dispatch = useDispatch();
  const session = useSession();

  if (features.isStripeSandboxEnabled) {
    return <button disabled>Checkout Unavailable</button>;
  }

  return (
    <>
      {session.data?.user ? (
        <button
          onClick={() => dispatch(setCheckout("checkout"))}
          disabled={isLoading || !isSuccess}
        >
          Checkout
        </button>
      ) : (
        <button onClick={() => signIn()} disabled={isLoading || !isSuccess}>
          Sign in to Checkout
        </button>
      )}
    </>
  );
}
