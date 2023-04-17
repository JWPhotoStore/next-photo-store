"use client";

import styles from "@/styles/Product.module.css";
import { ProductTypes } from "@/types/ProductTypes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { incrementQuantity, addCartItem } from "@/app/store/cartSlice";

function AddToCart({
  id,
  name,
  description,
  image,
  currency,
  unit_amount,
}: ProductTypes) {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    let cartItemToAdd = null;
    let isProductInCart = false;
    for (const cartItem of cartItems) {
      if (cartItem.id === id) {
        isProductInCart = true;
        cartItemToAdd = cartItem;
        break;
      }
    }

    if (isProductInCart && cartItemToAdd !== null) {
      dispatch(incrementQuantity(cartItemToAdd));
    } else {
      dispatch(
        addCartItem({
          id,
          name,
          description,
          image,
          currency,
          unit_amount,
          quantity: 1,
        })
      );
    }
  };

  return (
    <button onClick={handleAddToCart} className={styles.primaryButton}>
      Add to Cart
    </button>
  );
}

export default AddToCart;
