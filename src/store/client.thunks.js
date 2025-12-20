import api, { setAuthToken, clearAuthToken } from "../api/axios";
import { clearUser, setRoles, setUser } from "./client.actions";

const asArray = (x) => (Array.isArray(x) ? x : []);

// T09: Roles thunk (only if needed)
export const fetchRolesIfNeeded = () => async (dispatch, getState) => {
  const { roles } = getState().client;
  if (Array.isArray(roles) && roles.length > 0) return;

  try {
    const res = await api.get("/roles");
    dispatch(setRoles(asArray(res.data)));
  } catch (err) {
    console.error("fetchRolesIfNeeded error:", err);
    dispatch(setRoles([]));
  }
};

// T10: Login thunk
// rememberMe true ise token localStorage'a yazılır
export const loginThunk = ({ email, password }, rememberMe) => async (dispatch) => {
  const res = await api.post("/login", { email, password });
  const token = res?.data?.token;
  const user = res?.data?.user;

  if (token) {
    // NOT: Bearer prefix yok
    setAuthToken(token);
    if (rememberMe) localStorage.setItem("token", token);
  }

  if (user) dispatch(setUser(user));

  return user;
};

// T11: Auto login by token
export const verifyTokenThunk = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    setAuthToken(token);

    const res = await api.get("/verify");
    const user = res?.data?.user;
    const renewedToken = res?.data?.token;

    if (user) dispatch(setUser(user));

    if (renewedToken) {
      localStorage.setItem("token", renewedToken);
      setAuthToken(renewedToken);
    }
  } catch (err) {
    console.error("verifyTokenThunk error:", err);
    localStorage.removeItem("token");
    clearAuthToken();
    dispatch(clearUser());
  }
};

export const logoutThunk = () => (dispatch) => {
  localStorage.removeItem("token");
  clearAuthToken();
  dispatch(clearUser());
};
