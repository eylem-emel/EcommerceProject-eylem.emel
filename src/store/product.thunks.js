import { api } from "../api/axios";
import { setCategories, setFetchState } from "./product.actions";

/**
 * GET /categories
 * - categories redux'a yazılır (product.categories)
 */
export const fetchCategoriesIfNeeded = () => async (dispatch, getState) => {
  const categories = getState()?.product?.categories;

  if (Array.isArray(categories) && categories.length > 0) return;

  try {
    dispatch(setFetchState("FETCHING"));
    const res = await api.get("/categories");
    dispatch(setCategories(res.data || []));
    dispatch(setFetchState("FETCHED"));
  } catch (err) {
    console.error("fetchCategoriesIfNeeded error:", err);
    dispatch(setFetchState("FAILED"));
  }
};
