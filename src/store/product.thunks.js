import api from "../api/axios";
import { setCategories, setFetchState, setOffset, setProductList, setTotal } from "./product.actions";

/** categories response'u farklı şekillerde gelebilir, normalize edelim */
const normalizeCategories = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/** products response'u beklenen format: { total: 185, products: [...] } */
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

// ✅ params'ı URL'e çeviren yardımcı
const buildQueryString = (params = {}) => {
  const qs = new URLSearchParams();

  if (params.category !== undefined && params.category !== null && params.category !== "") {
    qs.set("category", String(params.category));
  }

  if (params.filter !== undefined && params.filter !== null && String(params.filter).trim() !== "") {
    qs.set("filter", String(params.filter).trim());
  }

  if (params.sort !== undefined && params.sort !== null && String(params.sort).trim() !== "") {
    qs.set("sort", String(params.sort).trim());
  }

  // T15: pagination params
  if (params.limit !== undefined && params.limit !== null && Number.isFinite(Number(params.limit))) {
    qs.set("limit", String(Number(params.limit)));
  }

  if (params.offset !== undefined && params.offset !== null && Number.isFinite(Number(params.offset))) {
    qs.set("offset", String(Number(params.offset)));
  }

  const s = qs.toString();
  return s ? `?${s}` : "";
};

/**
 * T12/T13: Fetch categories and save it in product reducer.
 * Endpoint: /categories
 */
export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch(setFetchState("FETCHING"));
    const res = await api.get("/categories");

    const list = normalizeCategories(res.data);

    // aynı id'yi iki kere basmayalım
    const uniqueList = Array.from(new Map((list || []).map((c) => [c.id, c])).values());

    dispatch(setCategories(uniqueList));
    dispatch(setFetchState("FETCHED"));
  } catch (err) {
    console.error("❌ fetchCategories error:", err);
    dispatch(setCategories([]));
    dispatch(setFetchState("FAILED"));
  }
};

export const fetchCategoriesIfNeeded = () => async (dispatch, getState) => {
  const list = getState()?.product?.categories;
  if (Array.isArray(list) && list.length > 0) return;
  return dispatch(fetchCategories());
};

/**
 * T14: Fetch products with query parameters
 * Endpoint: /products
 * Supports query params: category, filter, sort
 */
export const fetchProducts = (params = {}) => async (dispatch, getState) => {
  try {
    dispatch(setFetchState("FETCHING"));

    // T15: limit/offset default'ları store'dan gelsin
    const state = getState?.();
    const fallbackLimit = Number(state?.product?.limit ?? 25) || 25;
    const fallbackOffset = Number(state?.product?.offset ?? 0) || 0;

    const limit = params.limit !== undefined ? Number(params.limit) : fallbackLimit;
    const offset = params.offset !== undefined ? Number(params.offset) : fallbackOffset;

    // ✅ Artık URL'i kendimiz üretiyoruz: Network'te query kesin görünecek
    const query = buildQueryString({ ...params, limit, offset });
    const url = `/products${query}`;

    console.log("✅ fetchProducts URL:", url); // debug amaçlı (istersen sonra silersin)

    // Spinner gözle görülsün diye minimum bekleme
    const minDelay = new Promise((r) => setTimeout(r, 300));
    const resPromise = api.get(url, {
      // cache yüzünden "304" kafa karıştırmasın diye
      headers: { "Cache-Control": "no-cache" },
    });

    const [res] = await Promise.all([resPromise, minDelay]);

    const { total, products } = normalizeProductsResponse(res.data);

    // T15: infinite scroll / pagination destek
    // append: true => mevcut listeye ekle
    const append = Boolean(params?.append);
    const currentList = append
      ? (Array.isArray(state?.product?.productList) ? state.product.productList : [])
      : [];

    const nextList = append ? [...currentList, ...products] : products;

    dispatch(setTotal(total));
    dispatch(setProductList(nextList));

    // offset store'da "next offset" gibi tutulur: bir sonraki istekte kaç ürün geçileceği
    dispatch(setOffset(offset + (Array.isArray(products) ? products.length : 0)));

    dispatch(setFetchState("FETCHED"));
  } catch (err) {
    console.error("❌ fetchProducts error:", err);
    dispatch(setTotal(0));
    dispatch(setProductList([]));
    dispatch(setFetchState("FAILED"));
  }
};

export const fetchProductsIfNeeded = (params = {}) => async (dispatch, getState) => {
  const list = getState()?.product?.productList;
  if (Array.isArray(list) && list.length > 0) return;
  return dispatch(fetchProducts(params));
};
