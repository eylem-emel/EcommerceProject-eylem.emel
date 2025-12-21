import {
  ADD_TO_CART,
  DECREASE_CART_ITEM,
  REMOVE_FROM_CART,
  TOGGLE_CART_ITEM,
  CLEAR_CART,
} from "./shoppingCart.types";

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

// Sepet sayfasında adet azaltma (1'e inerse ürünü kaldırır)
export const decreaseCartItem = (productId) => ({
  type: DECREASE_CART_ITEM,
  payload: productId,
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
