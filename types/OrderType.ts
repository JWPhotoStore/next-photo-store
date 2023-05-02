import { CartItemTypes } from "./CartItemTypes";

export type OrderType = {
  currency: string;
  paymentIntentId: string;
  products: CartItemTypes[];
};
