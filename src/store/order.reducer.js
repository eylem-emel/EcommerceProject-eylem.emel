// src/store/order.reducer.js

import { SET_ORDERS, SET_ORDER_FETCH_STATE, SET_ORDER_ERROR } from "./order.actions";

const initialState = {
  orders: [],
  fetchState: "NOT_FETCHED", // "NOT_FETCHED" | "FETCHING" | "FETCHED" | "FAILED"
  error: null,
};

export default function orderReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ORDER_FETCH_STATE:
      return { ...state, fetchState: action.payload };

    case SET_ORDERS:
      return { ...state, orders: action.payload, error: null };

    case SET_ORDER_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
