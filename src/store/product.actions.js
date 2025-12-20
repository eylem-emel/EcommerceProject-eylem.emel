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

export const setCategories = (categories) => ({
  type: SET_CATEGORIES,
  payload: categories,
});

export const setProductList = (products) => ({
  type: SET_PRODUCT_LIST,
  payload: products,
});

export const setTotal = (total) => ({
  type: SET_TOTAL,
  payload: total,
});

export const setFetchState = (fetchState) => ({
  type: SET_FETCH_STATE,
  payload: fetchState,
});

export const setLimit = (limit) => ({
  type: SET_LIMIT,
  payload: limit,
});

export const setOffset = (offset) => ({
  type: SET_OFFSET,
  payload: offset,
});

export const setFilter = (filter) => ({
  type: SET_FILTER,
  payload: filter,
});

export const setSort = (sort) => ({
  type: SET_SORT,
  payload: sort,
});

// T16
export const setSelectedProduct = (product) => ({
  type: SET_SELECTED_PRODUCT,
  payload: product,
});

export const setSelectedProductFetchState = (state) => ({
  type: SET_SELECTED_PRODUCT_FETCH_STATE,
  payload: state,
});
