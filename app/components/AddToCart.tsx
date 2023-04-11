"use client";

import styles from "@/styles/Product.module.css";
import { SearchParamTypes } from "@/types/SearchParamsTypes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { incrementQuantity, addCartItem } from "@/app/store/cartSlice";

function AddToCart({ searchParams }: SearchParamTypes) {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    let cartItemToAdd = null;
    let isProductInCart = false;
    for (const cartItem of cartItems) {
      if (cartItem.id === searchParams.id) {
        isProductInCart = true;
        cartItemToAdd = cartItem;
        break;
      }
    }

    if (isProductInCart && cartItemToAdd !== null) {
      dispatch(incrementQuantity(cartItemToAdd));
    } else {
      dispatch(addCartItem({ ...searchParams, quantity: 1 }));
    }
  };

  return (
    <button onClick={handleAddToCart} className={styles.addToCart}>
      Add to Cart
    </button>
  );
}

export default AddToCart;
