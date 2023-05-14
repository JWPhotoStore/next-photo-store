import { CartItemType } from "@/types/CartItemType";

export const sumItemsAndQuantity = (cartItems: CartItemType[]) => {
  return cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.quantity;
  }, 0);
};

const updateLocalStorageAndAddListener = (cartItems: CartItemType[]) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  window.dispatchEvent(new Event("cartItemLocalStorage"));
};

export const addCartItemToLocalStorage = (targetItem: CartItemType) => {
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

export const deleteCartItemToLocalStorage = (targetItemName: string) => {
  const cartItems: CartItemType[] = getCartItemsLS();
  const targetItemIdx = cartItems.findIndex((ci) => ci.name === targetItemName);
  cartItems.splice(targetItemIdx, 1);
  updateLocalStorageAndAddListener(cartItems);
};

export const getCartItemsLS = () => {
  const localStorageCartItems = localStorage.getItem("cartItems");
  if (!localStorageCartItems) return [];
  return JSON.parse(localStorageCartItems);
};

export const getCartItemsTotalQuantityLS = () => {
  const lsCartItems = getCartItemsLS();
  return sumItemsAndQuantity(lsCartItems);
};
