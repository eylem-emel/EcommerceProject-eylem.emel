// src/store/auth.thunks.js
import { api } from "../api/axios";
import { setUser } from "./client.actions";

export const loginThunk = ({ email, password, remember }) => {
  return async (dispatch) => {
    const res = await api.post("/login", { email, password });
    const data = res?.data || {};

    // API bazen token/user'ı farklı isimlerle döndürebiliyor:
    const token =
      data.token || data.access_token || data.accessToken || data.jwt || null;

    const userFromApi = data.user || data;

    // User objesini garantiye alalım
    const user = {
      name: userFromApi?.name || "User",
      email: userFromApi?.email || email,
      role_id: userFromApi?.role_id ?? null,
      ...userFromApi,
    };

    // remember -> localStorage token
    if (remember && token) localStorage.setItem("token", token);
    if (!remember) localStorage.removeItem("token");

    dispatch(setUser(user));

    // LoginPage await ile bunu alacak
    return { token, user, raw: data };
  };
};
