import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* 🔐 TOKEN HELPERS */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = token;
  }
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;
