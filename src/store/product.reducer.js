import {
  SET_CATEGORIES,
  SET_PRODUCT_LIST,
  SET_TOTAL,
  SET_FETCH_STATE,
  SET_LIMIT,
  SET_OFFSET,
  SET_FILTER,
} from "./product.types";

const initialState = {
  categories: [],
  productList: [],
  total: 0,
  limit: 25,
  offset: 0,
  filter: "",
  fetchState: "NOT_FETCHED",
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORIES:
      return { ...state, categories: Array.isArray(action.payload) ? action.payload : [] };
    case SET_PRODUCT_LIST:
      return { ...state, productList: Array.isArray(action.payload) ? action.payload : [] };
    case SET_TOTAL:
      return { ...state, total: Number(action.payload ?? 0) };
    case SET_FETCH_STATE:
      return { ...state, fetchState: action.payload ?? state.fetchState };
    case SET_LIMIT:
      return { ...state, limit: Number(action.payload ?? state.limit) };
    case SET_OFFSET:
      return { ...state, offset: Number(action.payload ?? state.offset) };
    case SET_FILTER:
      return { ...state, filter: action.payload ?? "" };
    default:
      return state;
  }
}
