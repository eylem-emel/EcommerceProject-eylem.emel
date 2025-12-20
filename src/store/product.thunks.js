import axios from "axios";
import {
  setSelectedProduct,
  setSelectedProductFetchState,
  setProductList,
} from "./product.actions";

// Projende bu endpoint kullanılıyor olabilir
const API_BASE = "https://workintech-fe-ecommerce.onrender.com";

/**
 * Header menüsü için: kategorileri ürün listesinden türetmek (kolay yol).
 * Eğer ayrı bir /categories endpoint'in varsa, bunu ona göre değiştirebilirsin.
 */
export const fetchCategoriesIfNeeded = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const currentList = state?.product?.productList || [];

    // zaten doluysa tekrar çekme
    if (currentList.length > 0) return;

    // Ürün listesini çekiyoruz (kategoriler buradan türetilebilir)
    const response = await axios.get(`${API_BASE}/products`);
    dispatch(setProductList(response.data));
  } catch (error) {
    console.error("Categories/Product list fetch error:", error);
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
