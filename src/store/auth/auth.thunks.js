import api, { setAuthToken, clearAuthToken } from "../../api/axios";
import { setUser, logout } from "./auth.actions";

/* 🔑 LOGIN */
export const loginThunk = (credentials, rememberMe) => async (dispatch) => {
  const response = await api.post("/login", credentials);

  const { token, user } = response.data;

  if (rememberMe) {
    localStorage.setItem("token", token);
  }

  setAuthToken(token);
  dispatch(setUser(user));
};

/* 🔁 AUTO LOGIN (T11) */
export const verifyTokenThunk = () => async (dispatch) => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    setAuthToken(token);

    const response = await api.get("/verify");

    const { user, token: renewedToken } = response.data;

    dispatch(setUser(user));

    if (renewedToken) {
      localStorage.setItem("token", renewedToken);
      setAuthToken(renewedToken);
    }
  } catch (error) {
    localStorage.removeItem("token");
    clearAuthToken();
    dispatch(logout());
  }
};
