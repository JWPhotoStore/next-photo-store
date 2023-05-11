"use client";

import { ProductType } from "@/types/ProductType";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setPaymentIntent } from "../store/stripeSlice";
// import { addCartItem } from "../store/cartSlice";
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
  // const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  // const dispatch = useDispatch();

  const [addCartItem] = useAddCartItemMutation();

  const handleAdd = async (e: React.SyntheticEvent) => {
    //TODO: Look into how to get back the response object - Currently work working
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
      .unwrap()
      .then((data) => console.log(data));
  };

  return (
    <button
      onClick={
        // () =>
        //   addCartItem({
        //     name,
        //     description,
        //     image,
        //     unit_amount,
        //     currency,
        //     quantity,
        //     paymentIntentID,
        //     stripeProductId: id,
        //   })
        (e) => handleAdd(e)
      }
    >
      Add To Cart
    </button>
  );
}
