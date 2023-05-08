"use client";

import { ProductType } from "@/types/ProductType";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setPaymentIntent } from "../store/stripeSlice";
import { addCartItem } from "../store/cartSlice";

interface AddToCart_newType extends ProductType {
  quantity: number;
}

export default function AddToCart_new({
  id,
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
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  const dispatch = useDispatch();

  const handleAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();

    fetch("/api/add-to-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stripeProductId: id,
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
        dispatch(setPaymentIntent(data.id));
        dispatch(addCartItem(data.cartItem));
        //TODO: need to handle whether to update the whole cart when updating an existing cartItem and adding a new item to the cart
      });
  };

  return <button onClick={handleAdd}>Add To Cart</button>;
}
