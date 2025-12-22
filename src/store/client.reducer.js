// src/store/client.reducer.js

import {
  SET_USER,
  SET_ROLES,
  SET_THEME,
  SET_LANGUAGE,
  SET_ADDRESS_LIST,
  SET_CREDIT_CARDS,
} from "./client.types";

const initialState = {
  user: null,          // {Object}
  addressList: [],     // {Object Array}
  creditCards: [],     // {Object Array}
  roles: [],           // {Object Array}
  theme: "light",      // {String}
  language: "tr",      // {String}
};

export default function clientReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };

    case SET_ROLES:
      return { ...state, roles: action.payload };

    case SET_THEME:
      return { ...state, theme: action.payload };

    case SET_LANGUAGE:
      return { ...state, language: action.payload };

    case SET_ADDRESS_LIST:
      return { ...state, addressList: action.payload };

    case SET_CREDIT_CARDS:
      return { ...state, creditCards: action.payload };

    default:
      return state;
  }
}
