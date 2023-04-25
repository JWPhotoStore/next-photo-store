import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CartItemTypes } from "@/types/CartItemTypes";

export interface CartState {
  isOpen: boolean;
  cartItems: CartItemTypes[];
  paymentIntent: string;
  onCheckout: string;
}

const initialState: CartState = {
  isOpen: false,
  cartItems: [],
  paymentIntent: "",
  onCheckout: "cart",
};

//TODO: potentially break out certain reducers into their own slice
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    addCartItem: (state, action: PayloadAction<CartItemTypes>) => {
      state.cartItems.push(action.payload);
    },
    incrementQuantity: (state, action: PayloadAction<CartItemTypes>) => {
      for (const cartItem of state.cartItems) {
        if (cartItem.id === action.payload.id) {
          cartItem.quantity += 1;
          return;
        }
      }
    },
    decrementQuantity: (state, action: PayloadAction<CartItemTypes>) => {
      for (const cartItem of state.cartItems) {
        if (cartItem.id === action.payload.id) {
          if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
          } else {
            //TODO: The experience of the item being removed (when decrementing from 1) from the cart feels very abrupt
            const updatedCart = state.cartItems.filter(
              (cartItem) => cartItem.id !== action.payload.id
            );
            state.cartItems = updatedCart;
          }
          return;
        }
      }
    },
    removeCartItem: (state, action: PayloadAction<CartItemTypes>) => {
      const filteredCartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );
      state.cartItems = filteredCartItems;
    },
    setPaymentIntent: (state, action: PayloadAction<string>) => {
      state.paymentIntent = action.payload;
    },
    setCheckout: (state, action: PayloadAction<string>) => {
      state.onCheckout = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleCart,
  addCartItem,
  incrementQuantity,
  decrementQuantity,
  removeCartItem,
  setPaymentIntent,
  setCheckout,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
