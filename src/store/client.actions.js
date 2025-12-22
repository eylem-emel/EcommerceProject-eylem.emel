import {
  SET_USER,
  CLEAR_USER,
  SET_ROLES,
  SET_THEME,
  SET_LANGUAGE,
  SET_ADDRESS_LIST,
  SET_CREDIT_CARDS,
} from "./client.types";

export const setUser = (user) => ({ type: SET_USER, payload: user });
export const clearUser = () => ({ type: CLEAR_USER });

export const setRoles = (roles) => ({ type: SET_ROLES, payload: roles });
export const setTheme = (theme) => ({ type: SET_THEME, payload: theme });
export const setLanguage = (language) => ({ type: SET_LANGUAGE, payload: language });

// T20/T21
export const setAddressList = (list) => ({ type: SET_ADDRESS_LIST, payload: list });
export const setCreditCards = (list) => ({ type: SET_CREDIT_CARDS, payload: list });
