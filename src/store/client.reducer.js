import { SET_LANGUAGE, SET_ROLES, SET_THEME, SET_USER } from "./client.types";

const initialState = {
  user: {},
  addressList: [],
  creditCards: [],
  roles: [],
  theme: "light",
  language: "tr",
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

    default:
      return state;
  }
}
