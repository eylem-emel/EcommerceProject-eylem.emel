import { api } from "../api/axios";
import { setUser } from "./client.actions";

export const loginThunk = (form, remember) => async (dispatch) => {
  try {
    const res = await api.post("/login", {
      email: form.email,
      password: form.password,
    });

    const token = res.data?.token;
    const user = res.data?.user ?? res.data;

    if (remember && token) {
      localStorage.setItem(
        "token",
        token.startsWith("Bearer ") ? token : `Bearer ${token}`
      );
    } else {
      localStorage.removeItem("token");
    }

    dispatch(setUser(user));
    return { ok: true, user };
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Login başarısız. Email/şifreyi kontrol et.";
    return { ok: false, message: msg };
  }
};
