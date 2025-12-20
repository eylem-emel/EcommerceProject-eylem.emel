import api from "../api/axios";
import { setCategories, setFetchState } from "./product.actions";

const normalizeCategories = (data) => {
  // Olası formatlar:
  // 1) [ ... ]
  // 2) { categories: [ ... ] }
  // 3) { data: [ ... ] }
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

    dispatch(setCategories(list));
    dispatch(setFetchState("FETCHED"));
  } catch (err) {
    console.error("fetchCategoriesIfNeeded error:", err);
    dispatch(setCategories([])); // ✅ crash olmasın
    dispatch(setFetchState("FAILED"));
  }
};
