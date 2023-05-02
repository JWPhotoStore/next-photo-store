"use client";

import { ProductTypes } from "@/types/ProductTypes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setPaymentIntent } from "@/app/store/cartSlice";

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
  const { paymentIntentID, onCheckout } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const dispatch = useDispatch();

  const handleAdd = (e) => {
    e.preventDefault();

    console.log(onCheckout);

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
      });
  };

  return <button onClick={handleAdd}>Add new</button>;
}
