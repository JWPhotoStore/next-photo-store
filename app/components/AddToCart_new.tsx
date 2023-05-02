"use client";

import { ProductTypes } from "@/types/ProductTypes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setPaymentIntent } from "../store/stripeSlice";

interface AddToCart_newType extends ProductTypes {
  quantity: number;
}

export default function AddToCart_new({
  name,
  description,
  image,
  unit_amount,
  currency,
  quantity,
}: AddToCart_newType) {
  const { paymentIntentID } = useSelector(
    (state: RootState) => state.stripeReducer
  );
  const dispatch = useDispatch();

  const handleAdd = (e) => {
    e.preventDefault();

    fetch("/api/add-to-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        image,
        unit_amount,
        currency,
        quantity,
        paymentIntentID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch(setPaymentIntent(data.id));
        console.log(data.product);
      });
  };

  return <button onClick={handleAdd}>Add new</button>;
}
