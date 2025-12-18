import { SET_USER, SET_ROLES, SET_THEME, SET_LANGUAGE, CLEAR_USER } from "./client.types";

const initialState = {
  user: null,
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

    case CLEAR_USER:
      return { ...state, user: null };

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
