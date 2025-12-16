import { setRoles } from "./client.actions";
import { api } from "../api/axios";

export const fetchRolesIfNeeded = () => async (dispatch, getState) => {
  const { roles } = getState().client;

  // only if needed
  if (Array.isArray(roles) && roles.length > 0) return;

  try {
    const res = await api.get("/roles");

    const list =
      (Array.isArray(res.data) && res.data) ||
      (Array.isArray(res.data?.data) && res.data.data) ||
      (Array.isArray(res.data?.roles) && res.data.roles) ||
      (Array.isArray(res.data?.data?.roles) && res.data.data.roles) ||
      [];

    dispatch(setRoles(list));
  } catch (err) {
    console.error("fetchRolesIfNeeded error:", err);
    // task istemediği için store'a error basmıyoruz
  }
};
