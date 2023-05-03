import { CartItemTypes } from "./CartItemTypes";

export type OrderType = {
  currency: string;
  paymentIntentID: string;
  cartItems: CartItemTypes[];
};
