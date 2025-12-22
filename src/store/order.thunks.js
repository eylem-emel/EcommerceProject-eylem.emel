import api from "../api/axios";
import { setAddressList, setCreditCards } from "./client.actions";
import { clearCart } from "./shoppingCart.actions";

const asArray = (x) => (Array.isArray(x) ? x : []);

// ---------- Addresses (T20) ----------
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

// ---------- Credit cards (T21) ----------
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

// ---------- Orders (T22/T23) ----------
export const createOrderThunk = (payload) => async (dispatch) => {
  const res = await api.post("/order", payload);
  dispatch(clearCart());
  return res?.data;
};

export const fetchOrdersThunk = () => async () => {
  const res = await api.get("/order");
  return res?.data;
};
