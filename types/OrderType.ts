import { CartItemType } from "./CartItemType";

export type OrderType = {
  currency: string;
  paymentIntentID: string;
  cartItems: CartItemType[];
};
