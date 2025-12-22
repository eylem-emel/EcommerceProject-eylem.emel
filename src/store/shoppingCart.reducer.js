// src/store/shoppingCart.reducer.js

import {
  SET_CART,
  SET_PAYMENT,
  SET_ADDRESS,
} from "./shoppingCart.types";

const initialState = {
  cart: [],
  payment: {},   // ✅ Task T09 istiyor
  address: {},   // ✅ Task T09 istiyor
};

export default function shoppingCartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return {
        ...state,
        cart: action.payload,
      };

    case SET_PAYMENT:
      return {
        ...state,
        payment: action.payload,
      };

    case SET_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };

    default:
      return state;
  }
}
