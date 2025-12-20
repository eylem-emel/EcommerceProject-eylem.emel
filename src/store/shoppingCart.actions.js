import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  TOGGLE_CART_ITEM,
  CLEAR_CART,
} from "./shoppingCart.types";

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const toggleCartItem = (productId) => ({
  type: TOGGLE_CART_ITEM,
  payload: productId,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});
