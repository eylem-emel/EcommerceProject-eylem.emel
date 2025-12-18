import { api } from "../api/axios";
import { setRoles } from "./client.actions";

export const fetchRolesIfNeeded = () => async (dispatch, getState) => {
  const roles = getState().client.roles;

  if (Array.isArray(roles) && roles.length > 0) return;

  try {
    const res = await api.get("/roles");
    dispatch(setRoles(res.data));
  } catch (err) {
    console.error("fetchRolesIfNeeded error:", err);
  }
};
