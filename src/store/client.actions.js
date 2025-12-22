// src/store/client.actions.js

export const SET_USER = "client/SET_USER";
export const CLEAR_USER = "client/CLEAR_USER";
export const SET_ROLES = "client/SET_ROLES";
export const SET_THEME = "client/SET_THEME";
export const SET_LANGUAGE = "client/SET_LANGUAGE";

export const SET_ADDRESS_LIST = "client/SET_ADDRESS_LIST";
export const SET_CREDIT_CARDS = "client/SET_CREDIT_CARDS"; // ✅ EKLENDİ

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const setRoles = (roles) => ({
  type: SET_ROLES,
  payload: roles,
});

export const setTheme = (theme) => ({
  type: SET_THEME,
  payload: theme,
});

export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  payload: language,
});

export const setAddressList = (addressList) => ({
  type: SET_ADDRESS_LIST,
  payload: addressList,
});

// ✅ YENİ ACTION
export const setCreditCards = (creditCards) => ({
  type: SET_CREDIT_CARDS,
  payload: creditCards,
});
