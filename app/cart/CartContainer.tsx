"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import styles from "@/styles/CartItem.module.css";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import Checkout from "../components/Checkout";
import { setCheckout } from "../store/cartSlice";

// Need to set isOpen back to false whenever I click back to home page or back
export default function CartContainer() {
  const { isOpen, cartItems, onCheckout } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.cartContainer}>
        {onCheckout === "cart" && (
          <>
            <CartItems />
            {cartItems.length > 0 && <CartSummary cartItems={cartItems} />}
            <button onClick={() => dispatch(setCheckout("checkout"))}>
              Checkout
            </button>
          </>
        )}
        {onCheckout === "checkout" && <Checkout />}
      </div>
    </>
  );
}
