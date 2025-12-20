import axios from "axios";
import {
  setSelectedProduct,
  setSelectedProductFetchState,
  setProductList,
} from "./product.actions";

const API_BASE = "https://workintech-fe-ecommerce.onrender.com";

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

export const fetchCategoriesIfNeeded = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const list = normalizeList(state?.product?.productList);
    if (list.length > 0) return;

    const response = await axios.get(`${API_BASE}/products`);
    dispatch(setProductList(normalizeList(response.data)));
  } catch (error) {
    console.error("Product list fetch error:", error);
    dispatch(setProductList([]));
  }
};

export const fetchProductById = (productId) => async (dispatch) => {
  try {
    dispatch(setSelectedProductFetchState("loading"));
    const response = await axios.get(`${API_BASE}/products/${productId}`);
    dispatch(setSelectedProduct(response.data));
    dispatch(setSelectedProductFetchState("success"));
  } catch (error) {
    console.error("Product fetch error:", error);
    dispatch(setSelectedProductFetchState("error"));
  }
};
