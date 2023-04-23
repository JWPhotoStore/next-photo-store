"use client";
import { CartItemTypes } from "@/types/CartItemTypes";
import formatPrice from "@/util/PriceFormat";
import CartItems from "./CartItems";
import { useSelector, useDispatch } from "react-redux";
import { setCheckout } from "../store/cartSlice";
import { RootState } from "@/app/store/store";

export default function CartSummary() {
  const { cartItems, onCheckout } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const dispatch = useDispatch();

  const calculateSum = () => {
    return cartItems.reduce((acc: number, item: CartItemTypes) => {
      return acc + item.unit_amount * item.quantity;
    }, 0);
  };

  return (
    <>
      {cartItems.length > 0 ? (
        <div>
          <CartItems />
          <div>
            <p>Total: {formatPrice(calculateSum())}</p>
          </div>
          <button onClick={() => dispatch(setCheckout("checkout"))}>
            Checkout
          </button>
        </div>
      ) : (
        <div>
          <h1>Your cart is empty</h1>
        </div>
      )}
    </>
  );
}
