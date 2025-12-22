// src/store/order.thunks.js

import api from "../api/axios";
import { setAddressList, setCreditCards } from "./client.actions";
import { clearCart } from "./shoppingCart.actions";
import { setOrders, setOrderFetchState, setOrderError } from "./order.actions";

const asArray = (x) => (Array.isArray(x) ? x : []);

// ======================================================
// T20 - ADDRESS
// ======================================================

export const fetchAddressesThunk = () => async (dispatch) => {
  const res = await api.get("/user/address");
  const list = asArray(res?.data) || asArray(res?.data?.addresses);
  dispatch(setAddressList(list));
  return list;
};

export const addAddressThunk = (payload) => async (dispatch) => {
  await api.post("/user/address", payload);
  return dispatch(fetchAddressesThunk());
};

export const updateAddressThunk = (payload) => async (dispatch) => {
  await api.put("/user/address", payload);
  return dispatch(fetchAddressesThunk());
};

export const deleteAddressThunk = (addressId) => async (dispatch) => {
  await api.delete(`/user/address/${addressId}`);
  return dispatch(fetchAddressesThunk());
};

export const fetchAddressListThunk = fetchAddressesThunk;

// ======================================================
// T21 - CARD
// ======================================================

export const fetchCardsThunk = () => async (dispatch) => {
  const res = await api.get("/user/card");
  const list = asArray(res?.data) || asArray(res?.data?.cards);
  dispatch(setCreditCards(list));
  return list;
};

export const addCardThunk = (payload) => async (dispatch) => {
  await api.post("/user/card", payload);
  return dispatch(fetchCardsThunk());
};

export const updateCardThunk = (payload) => async (dispatch) => {
  await api.put("/user/card", payload);
  return dispatch(fetchCardsThunk());
};

export const deleteCardThunk = (cardId) => async (dispatch) => {
  await api.delete(`/user/card/${cardId}`);
  return dispatch(fetchCardsThunk());
};

export const fetchCardListThunk = fetchCardsThunk;

// ======================================================
// T22 - CREATE ORDER
// ======================================================

export const createOrderThunk = (payload) => async (dispatch) => {
  const res = await api.post("/order", payload);
  dispatch(clearCart());
  return res?.data;
};

// ======================================================
// T23 - PREVIOUS ORDERS
// ======================================================

export const fetchOrdersThunk = () => async (dispatch) => {
  try {
    dispatch(setOrderFetchState("FETCHING"));
    const res = await api.get("/order");
    const list = asArray(res?.data) || asArray(res?.data?.orders);
    dispatch(setOrders(list));
    dispatch(setOrderFetchState("FETCHED"));
    return list;
  } catch (err) {
    dispatch(setOrderFetchState("FAILED"));
    dispatch(setOrderError(err?.response?.data?.message || err.message));
    throw err;
  }
};

// ✅ sayfanın beklediği isim
export const fetchOrders = fetchOrdersThunk;
