export type CartItemType = {
  // id: string | null;
  id?: string;
  name: string;
  description: string | null;
  image: string;
  currency: string;
  unit_amount: number;
  quantity: number;
  stripeProductId: string;
};

export type CartItemBareType = {
  name: string;
  unit_amount: number;
  quantity: number;
};

export interface CartItemBackendType extends CartItemType {
  paymentIntentId: string;
}
