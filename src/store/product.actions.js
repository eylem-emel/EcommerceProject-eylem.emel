import {
  SET_PRODUCT_LIST,
  SET_SELECTED_PRODUCT,
  SET_SELECTED_PRODUCT_FETCH_STATE,
} from "./product.types";

export const setProductList = (products) => ({
  type: SET_PRODUCT_LIST,
  payload: products,
});

export const setSelectedProduct = (product) => ({
  type: SET_SELECTED_PRODUCT,
  payload: product,
});

export const setSelectedProductFetchState = (state) => ({
  type: SET_SELECTED_PRODUCT_FETCH_STATE,
  payload: state,
});
