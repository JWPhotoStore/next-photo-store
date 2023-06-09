import { CartItemBareType, CartItemType } from "@/types/CartItemType";

export const sumItemsAndQuantity = (cartItems: CartItemType[]): number => {
  return cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.quantity;
  }, 0);
};

export const calculateCartItemsSum = (cartItems: CartItemType[]): number => {
  return cartItems.reduce((acc: number, item: CartItemType) => {
    return acc + item.unit_amount * item.quantity;
  }, 0);
};

const updateLocalStorageAndAddListener = (cartItems: CartItemType[]): void => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  window.dispatchEvent(new Event("cartItemLocalStorage"));
};

export const addCartItemToLocalStorage = (targetItem: CartItemType): void => {
  const localStorageCartItems = localStorage.getItem("cartItems");

  if (!localStorageCartItems) {
    updateLocalStorageAndAddListener([targetItem]);
  } else {
    const cartItems: CartItemType[] = JSON.parse(localStorageCartItems);

    const targetItemIdx = cartItems.findIndex(
      (ci) => ci.name === targetItem.name
    );

    if (targetItemIdx === -1) {
      cartItems.push(targetItem);
    } else {
      cartItems[targetItemIdx].quantity += targetItem.quantity;
    }

    updateLocalStorageAndAddListener(cartItems);
  }
};

export const deleteCartItemToLocalStorage = (targetItemName: string): void => {
  const cartItems: CartItemType[] = getCartItemsLS();
  const targetItemIdx = cartItems.findIndex((ci) => ci.name === targetItemName);
  cartItems.splice(targetItemIdx, 1);
  updateLocalStorageAndAddListener(cartItems);
};

export const updateCartItemInLocalStorage = (
  cartItemToUpdate: CartItemBareType
): void => {
  const cartItems: CartItemType[] = getCartItemsLS();
  for (const cI of cartItems) {
    if (cI.name === cartItemToUpdate.name)
      cI.quantity = cartItemToUpdate.quantity;
  }
  updateLocalStorageAndAddListener(cartItems);
};

export const getCartItemsLS = (): CartItemType[] => {
  const localStorageCartItems = localStorage.getItem("cartItems");
  if (!localStorageCartItems) return [];
  return JSON.parse(localStorageCartItems);
};

export const getCartItemsTotalQuantityLS = (): number => {
  const lsCartItems = getCartItemsLS();
  return sumItemsAndQuantity(lsCartItems);
};

export const clearLocalStorage = () => {
  localStorage.removeItem("cartItems");
  window.dispatchEvent(new Event("cartItemLocalStorage"));
};
