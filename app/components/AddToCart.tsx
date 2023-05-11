"use client";

import { ProductType } from "@/types/ProductType";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { useAddCartItemMutation } from "../store/apiSlice";
import React from "react";

interface AddToCartType extends ProductType {
  quantity: number;
}

export default function AddToCart({
  id,
  name,
  description,
  image,
  unit_amount,
  currency,
  quantity,
}: AddToCartType) {
  const { paymentIntentID } = useSelector(
    (state: RootState) => state.stripeReducer
  );

  const [addCartItem, { isLoading }] = useAddCartItemMutation();

  return (
    <button
      onClick={() =>
        addCartItem({
          name,
          description,
          image,
          unit_amount,
          currency,
          quantity,
          paymentIntentID,
          stripeProductId: id,
        })
      }
      disabled={isLoading}
    >
      Add To Cart
    </button>
  );
}
