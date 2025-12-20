import api from "../api/axios";
import {
  setCategories,
  setProductList,
  setTotal,
  setFetchState,
  setSelectedProduct,
  setSelectedProductFetchState,
} from "./product.actions";

// küçük yardımcı: güvenli array
const asArray = (x) => (Array.isArray(x) ? x : []);

// T12: /categories
export const fetchCategoriesIfNeeded = () => async (dispatch, getState) => {
  const state = getState();
  if (state.product.categories && state.product.categories.length > 0) return;

  try {
    const res = await api.get("/categories");
    dispatch(setCategories(asArray(res.data)));
  } catch (e) {
    console.error("fetchCategories error:", e);
    dispatch(setCategories([]));
  }
};

// T13–T15: /products?category&filter&sort&limit&offset
export const fetchProducts = () => async (dispatch, getState) => {
  const { limit, offset, filter, sort } = getState().product;

  try {
    dispatch(setFetchState("FETCHING"));

    // query paramlar
    const params = {
      limit,
      offset,
    };
    if (filter) params.filter = filter;
    if (sort) params.sort = sort;

    // category seçiliyse products?category=...
    // category paramı T14’te URL’den geliyor; bunu store’a yazmak yerine
    // ShopPage’de fetchProductsByCategory gibi ayrı thunk da kullanabilirsin.
    // Şimdilik category’yi paramla dışarıdan vereceğiz.
    const res = await api.get("/products", { params });

    // beklenen format: { total, products: [] }
    const total = Number(res.data?.total) || 0;
    const products = asArray(res.data?.products);

    dispatch(setTotal(total));
    dispatch(setProductList(products));
    dispatch(setFetchState("FETCHED"));
  } catch (e) {
    console.error("fetchProducts error:", e);
    dispatch(setFetchState("FAILED"));
  }
};

// T14 category için: /products?category=ID + diğer paramlar korunur
export const fetchProductsByCategory = (categoryId) => async (dispatch, getState) => {
  const { limit, offset, filter, sort } = getState().product;

  try {
    dispatch(setFetchState("FETCHING"));

    const params = {
      limit,
      offset,
      category: categoryId,
    };
    if (filter) params.filter = filter;
    if (sort) params.sort = sort;

    const res = await api.get("/products", { params });

    const total = Number(res.data?.total) || 0;
    const products = asArray(res.data?.products);

    dispatch(setTotal(total));
    dispatch(setProductList(products));
    dispatch(setFetchState("FETCHED"));
  } catch (e) {
    console.error("fetchProductsByCategory error:", e);
    dispatch(setFetchState("FAILED"));
  }
};

// T16: /products/:productId
export const fetchProductById = (productId) => async (dispatch) => {
  try {
    dispatch(setSelectedProductFetchState("FETCHING"));
    const res = await api.get(`/products/${productId}`);
    dispatch(setSelectedProduct(res.data));
    dispatch(setSelectedProductFetchState("FETCHED"));
  } catch (e) {
    console.error("fetchProductById error:", e);
    dispatch(setSelectedProductFetchState("FAILED"));
  }
};
