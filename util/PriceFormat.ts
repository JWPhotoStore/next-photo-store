import { CartItemTypes } from "@/types/CartItemTypes";

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
};

export const calculateOrderAmount = (items: CartItemTypes[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_amount * item.quantity;
  }, 0);

  return totalPrice;
};
