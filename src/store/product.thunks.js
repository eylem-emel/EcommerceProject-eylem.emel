import api from "../api/axios";
import {
  setCategories,
  setProductList,
  setTotal,
  setFetchState,
  setSelectedProduct,
  setSelectedProductFetchState,
} from "./product.actions";

const toArray = (x) => (Array.isArray(x) ? x : []);

// ✅ T12: /categories
export const fetchCategoriesIfNeeded = () => async (dispatch, getState) => {
  const { categories } = getState().product;

  if (Array.isArray(categories) && categories.length > 0) return;

  try {
    const res = await api.get("/categories");
    dispatch(setCategories(toArray(res.data)));
  } catch (err) {
    console.error("fetchCategoriesIfNeeded error:", err);
    dispatch(setCategories([]));
  }
};

// ✅ T13–T15: /products (query params: category, filter, sort, limit, offset)
export const fetchProducts = (params = {}) => async (dispatch, getState) => {
  const state = getState().product;

  const mergedParams = {
    limit: state.limit ?? 25,
    offset: state.offset ?? 0,
    ...(state.filter ? { filter: state.filter } : {}),
    ...(state.sort ? { sort: state.sort } : {}),
    ...params, // category gibi dışarıdan gelenler
  };

  try {
    dispatch(setFetchState("FETCHING"));

    const res = await api.get("/products", { params: mergedParams });

    const total = Number(res.data?.total) || 0;
    const products = toArray(res.data?.products);

    dispatch(setTotal(total));
    dispatch(setProductList(products));
    dispatch(setFetchState("FETCHED"));
  } catch (err) {
    console.error("fetchProducts error:", err);
    dispatch(setFetchState("FAILED"));
  }
};

// ✅ T16: /products/:productId
export const fetchProductById = (productId) => async (dispatch) => {
  try {
    dispatch(setSelectedProductFetchState("FETCHING"));

    const res = await api.get(`/products/${productId}`);

    dispatch(setSelectedProduct(res.data));
    dispatch(setSelectedProductFetchState("FETCHED"));
  } catch (err) {
    console.error("fetchProductById error:", err);
    dispatch(setSelectedProductFetchState("FAILED"));
  }
};

// ----------------------------------------------------
// ✅ ALIAS’lar (bazı dosyalarda "...Thunk" isimleriyle çağrılıyor olabilir)
// ----------------------------------------------------
export const fetchProductByIdThunk = fetchProductById;
export const fetchProductsThunk = fetchProducts;
