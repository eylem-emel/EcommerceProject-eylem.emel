// src/store/order.thunks.js

import api from "../api/axios";
import { setAddressList, setCreditCards } from "./client.actions";
import { clearCart } from "./shoppingCart.actions";

const asArray = (x) => (Array.isArray(x) ? x : []);

// ======================================================
// T20 - ADDRESS
// ======================================================

export const fetchAddressesThunk = () => async (dispatch) => {
  const res = await api.get("/user/address");
  // Backend bazen direkt array döndürüyor, bazen objenin içinde döndürebiliyor
  const list = asArray(res?.data) || asArray(res?.data?.addresses);
  dispatch(setAddressList(list));
  return list;
};

export const addAddressThunk = (payload) => async (dispatch) => {
  await api.post("/user/address", payload);
  return dispatch(fetchAddressesThunk());
};

export const updateAddressThunk = (payload) => async (dispatch) => {
  // payload: { id, title, name, surname, phone, city, district, neighborhood }
  await api.put("/user/address", payload);
  return dispatch(fetchAddressesThunk());
};

export const deleteAddressThunk = (addressId) => async (dispatch) => {
  await api.delete(`/user/address/${addressId}`);
  return dispatch(fetchAddressesThunk());
};

// ✅ CreateOrderPage.jsx’te kullandığım isimlerle uyum için ALIAS export’lar:
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
  // payload: { card_no, expire_month, expire_year, name_on_card }
  await api.post("/user/card", payload);
  return dispatch(fetchCardsThunk());
};

export const updateCardThunk = (payload) => async (dispatch) => {
  // payload: { id, card_no, expire_month, expire_year, name_on_card }
  await api.put("/user/card", payload);
  return dispatch(fetchCardsThunk());
};

export const deleteCardThunk = (cardId) => async (dispatch) => {
  await api.delete(`/user/card/${cardId}`);
  return dispatch(fetchCardsThunk());
};

// ✅ CreateOrderPage.jsx’te kullandığım isimlerle uyum için ALIAS export’lar:
export const fetchCardListThunk = fetchCardsThunk;

// ======================================================
// T22 - CREATE ORDER
// ======================================================

export const createOrderThunk = (payload) => async (dispatch) => {
  const res = await api.post("/order", payload);
  dispatch(clearCart()); // sipariş sonrası sepeti sıfırla
  return res?.data;
};

// ======================================================
// T23 - PREVIOUS ORDERS
// ======================================================

export const fetchOrdersThunk = () => async () => {
  const res = await api.get("/order");
  return res?.data;
};
