import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CartItemTypes } from "@/types/CartItemTypes";

export interface CartState {
  isOpen: boolean;
  cartItems: CartItemTypes[];
  paymentIntent: string;
  // setPaymentIntent: (val:string) => void
  onCheckout: string;
}

const initialState: CartState = {
  isOpen: false,
  cartItems: [],
  paymentIntent: "",
  onCheckout: "",
};

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
          cartItem.quantity -= 1;
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
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleCart,
  addCartItem,
  incrementQuantity,
  decrementQuantity,
  removeCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;
