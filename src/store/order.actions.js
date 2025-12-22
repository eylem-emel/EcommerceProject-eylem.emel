// src/store/order.actions.js

export const SET_ORDERS = "order/SET_ORDERS";
export const SET_ORDER_FETCH_STATE = "order/SET_ORDER_FETCH_STATE";
export const SET_ORDER_ERROR = "order/SET_ORDER_ERROR";

export const setOrders = (orders) => ({
  type: SET_ORDERS,
  payload: orders,
});

export const setOrderFetchState = (fetchState) => ({
  type: SET_ORDER_FETCH_STATE,
  payload: fetchState,
});

export const setOrderError = (error) => ({
  type: SET_ORDER_ERROR,
  payload: error,
});
