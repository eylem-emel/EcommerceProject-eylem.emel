import api from "../api/axios";
import {
  setCategories,
  setFetchState,
  setProductList,
  setTotal,
} from "./product.actions";

/** categories response'u farklı şekillerde gelebilir, normalize edelim */
const normalizeCategories = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const fetchCategoriesIfNeeded = () => async (dispatch, getState) => {
  const categories = getState()?.product?.categories;
  if (Array.isArray(categories) && categories.length > 0) return;

  try {
    dispatch(setFetchState("FETCHING"));

    const res = await api.get("/categories");
    const list = normalizeCategories(res.data);

    // id ile uniq (tekrarları kaldır)
    const uniqueList = Array.from(
      new Map((list || []).map((c) => [c.id, c])).values()
    );

    dispatch(setCategories(uniqueList));
    dispatch(setFetchState("FETCHED"));
  } catch (err) {
    console.error("❌ fetchCategoriesIfNeeded error:", err);
    dispatch(setCategories([]));
    dispatch(setFetchState("FAILED"));
  }
};

/** T13 - products response'u beklenen format: { total: 185, products: [...] } */
const normalizeProductsResponse = (data) => {
  const total = Number(data?.total ?? 0) || 0;

  const products = Array.isArray(data?.products)
    ? data.products
    : Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];

  return { total, products };
};

/**
 * T13: Fetch products and save it in product reducer.
 * Endpoint: /products
 * Response: { total, products: [...] }
 */
export const fetchProducts = (params = {}) => async (dispatch) => {
  try {
    dispatch(setFetchState("FETCHING"));

    // Spinner gözle görülsün diye minimum bekleme
    // İstersen 0 yapıp kaldırabilirsin.
    const minDelay = new Promise((r) => setTimeout(r, 400));
    const resPromise = api.get("/products", { params });

    const [res] = await Promise.all([resPromise, minDelay]);

    const { total, products } = normalizeProductsResponse(res.data);

    dispatch(setTotal(total));
    dispatch(setProductList(products));
    dispatch(setFetchState("FETCHED"));
  } catch (err) {
    console.error("❌ fetchProducts error:", err);
    dispatch(setTotal(0));
    dispatch(setProductList([]));
    dispatch(setFetchState("FAILED"));
  }
};

export const fetchProductsIfNeeded =
  (params = {}) =>
  async (dispatch, getState) => {
    const list = getState()?.product?.productList;
    if (Array.isArray(list) && list.length > 0) return;
    return dispatch(fetchProducts(params));
  };
