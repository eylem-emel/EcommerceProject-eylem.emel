// src/store/shoppingCart.actions.js

import {
  SET_CART,
  SET_PAYMENT,
  SET_ADDRESS,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREASE_COUNT,
  DECREASE_COUNT,
  TOGGLE_CHECKED,
  CLEAR_CART,
} from "./shoppingCart.types";

// --------------------
// Task T09 (vanilla)
// --------------------
export const setCart = (cart) => ({
  type: SET_CART,
  payload: cart,
});

export const setPayment = (payment) => ({
  type: SET_PAYMENT,
  payload: payment,
});

export const setAddress = (address) => ({
  type: SET_ADDRESS,
  payload: address,
});

// --------------------
// T17-T18 helper actions
// --------------------
export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const increaseCount = (productId) => ({
  type: INCREASE_COUNT,
  payload: productId,
});

export const decreaseCount = (productId) => ({
  type: DECREASE_COUNT,
  payload: productId,
});

export const toggleChecked = (productId) => ({
  type: TOGGLE_CHECKED,
  payload: productId,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});
