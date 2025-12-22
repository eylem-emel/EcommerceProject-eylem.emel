// src/store/shoppingCart.reducer.js

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

const initialState = {
  cart: [],
  payment: {}, // ✅ Task T09
  address: {}, // ✅ Task T09
};

export default function shoppingCartReducer(state = initialState, action) {
  switch (action.type) {
    // ---------- Task T09 ----------
    case SET_CART:
      return { ...state, cart: action.payload };

    case SET_PAYMENT:
      return { ...state, payment: action.payload };

    case SET_ADDRESS:
      return { ...state, address: action.payload };

    // ---------- T17: Add to cart ----------
    case ADD_TO_CART: {
      const product = action.payload;
      const existing = state.cart.find((i) => i.product?.id === product?.id);

      if (existing) {
        const nextCart = state.cart.map((i) =>
          i.product.id === product.id
            ? { ...i, count: i.count + 1 }
            : i
        );
        return { ...state, cart: nextCart };
      }

      const nextCart = [
        ...state.cart,
        { count: 1, checked: true, product },
      ];
      return { ...state, cart: nextCart };
    }

    // ---------- T18: Count & remove & select ----------
    case REMOVE_FROM_CART: {
      const productId = action.payload;
      const nextCart = state.cart.filter((i) => i.product?.id !== productId);
      return { ...state, cart: nextCart };
    }

    case INCREASE_COUNT: {
      const productId = action.payload;
      const nextCart = state.cart.map((i) =>
        i.product?.id === productId ? { ...i, count: i.count + 1 } : i
      );
      return { ...state, cart: nextCart };
    }

    case DECREASE_COUNT: {
      const productId = action.payload;
      const nextCart = state.cart
        .map((i) =>
          i.product?.id === productId
            ? { ...i, count: Math.max(1, i.count - 1) }
            : i
        );
      return { ...state, cart: nextCart };
    }

    case TOGGLE_CHECKED: {
      const productId = action.payload;
      const nextCart = state.cart.map((i) =>
        i.product?.id === productId ? { ...i, checked: !i.checked } : i
      );
      return { ...state, cart: nextCart };
    }

    case CLEAR_CART:
      return { ...state, cart: [] };

    default:
      return state;
  }
}
