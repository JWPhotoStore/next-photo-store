"use client";

import { ProductType } from "@/types/ProductType";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useAddCartItemMutation } from "../store/apiSlice";
import React from "react";
import { CartItemType } from "@/types/CartItemType";
import { addCartItemToLocalStorage } from "@/util/cart-item-utils";

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
  const { paymentIntentId } = useSelector(
    (state: RootState) => state.stripeReducer
  );

  const [addCartItem, { isLoading }] = useAddCartItemMutation();

  const handleAddToCart = async () => {
    const cartItem: CartItemType = {
      name,
      description,
      image,
      unit_amount,
      currency,
      quantity,
      stripeProductId: id,
    };

    const dataToSend = { ...cartItem, paymentIntentId };
    try {
      await addCartItem(dataToSend).unwrap();
    } catch (err) {
      if (err.status === 403) {
        // TODO: 403 = not logged in. Add TS typing
        addCartItemToLocalStorage(cartItem);
      }
    }
  };

  return (
    <button onClick={() => handleAddToCart()} disabled={isLoading}>
      Add To Cart
    </button>
  );
}
