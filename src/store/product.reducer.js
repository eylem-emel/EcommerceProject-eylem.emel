import {
  SET_CATEGORIES,
  SET_PRODUCT_LIST,
  SET_TOTAL,
  SET_FETCH_STATE,
  SET_LIMIT,
  SET_OFFSET,
  SET_FILTER,
  SET_SORT,
  SET_SELECTED_PRODUCT,
  SET_SELECTED_PRODUCT_FETCH_STATE,
} from "./product.types";

const initialState = {
  // T09
  categories: [],
  productList: [],
  total: 0,
  limit: 25,
  offset: 0,
  filter: "",
  sort: "", // T14 için
  fetchState: "NOT_FETCHED", // NOT_FETCHED | FETCHING | FETCHED | FAILED

  // T16 (ek alanlar, task’ları bozmaz)
  selectedProduct: null,
  selectedFetchState: "NOT_FETCHED", // NOT_FETCHED | FETCHING | FETCHED | FAILED
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORIES:
      return { ...state, categories: Array.isArray(action.payload) ? action.payload : [] };

    case SET_PRODUCT_LIST:
      return { ...state, productList: Array.isArray(action.payload) ? action.payload : [] };

    case SET_TOTAL:
      return { ...state, total: Number(action.payload) || 0 };

    case SET_FETCH_STATE:
      return { ...state, fetchState: action.payload };

    case SET_LIMIT:
      return { ...state, limit: Number(action.payload) || 25 };

    case SET_OFFSET:
      return { ...state, offset: Number(action.payload) || 0 };

    case SET_FILTER:
      return { ...state, filter: action.payload ?? "" };

    case SET_SORT:
      return { ...state, sort: action.payload ?? "" };

    // T16
    case SET_SELECTED_PRODUCT:
      return { ...state, selectedProduct: action.payload };

    case SET_SELECTED_PRODUCT_FETCH_STATE:
      return { ...state, selectedFetchState: action.payload };

    default:
      return state;
  }
}
