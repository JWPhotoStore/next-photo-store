import { CartItemType } from "./CartItemType";

export type OrderType = {
  currency: string;
  paymentIntentId: string;
  cartItems: CartItemType[];
};
