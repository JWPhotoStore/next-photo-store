import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CartItemType } from "@/types/CartItemType";

type CheckoutState = "cart" | "checkout" | "success";

export interface CartState {
  isOpen: boolean;
  cartItems: CartItemType[];
  // paymentIntentID: string;
  onCheckout: CheckoutState;
}

const initialState: CartState = {
  isOpen: false,
  cartItems: [
    // TODO: Remove this before deploying to Prod.
    // Purpose is to initialize with one item in cart for debugging
    // {
    //   id: "prod_NiQnnE5MIzmWI2",
    //   name: "Container",
    //   description: "Got it from the Container Store",
    //   image:
    //     "https://files.stripe.com/links/MDB8YWNjdF8xTXRjSXdLUUthaGFFR1hXfGZsX3Rlc3RfbjlUVjU0MzZhTFV6bVExR2NVMUY1S3FZ00pVXhmM2A",
    //   currency: "usd",
    //   unit_amount: 999,
    //   quantity: 1,
    // },
  ],
  // paymentIntentID: "",
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
    addCartItem: (state, action: PayloadAction<CartItemType>) => {
      state.cartItems.push(action.payload);
    },
    incrementQuantity: (state, action: PayloadAction<CartItemType>) => {
      for (const cartItem of state.cartItems) {
        if (cartItem.id === action.payload.id) {
          cartItem.quantity += 1;
          return;
        }
      }
    },
    decrementQuantity: (state, action: PayloadAction<CartItemType>) => {
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
    removeCartItem: (state, action: PayloadAction<CartItemType>) => {
      const filteredCartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );
      state.cartItems = filteredCartItems;
    },
    setCheckout: (state, action: PayloadAction<CheckoutState>) => {
      state.onCheckout = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    //TODO: create a payloadAction type for this
    updateCart: (state, action) => {
      state.cartItems = action.payload;
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
  setCheckout,
  clearCart,
  updateCart,
} = cartSlice.actions;

export default cartSlice.reducer;
