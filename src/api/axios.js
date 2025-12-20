import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://workintech-fe-ecommerce.onrender.com";

const api = axios.create({
  baseURL,
});

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = token; // Bearer YOK
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;
