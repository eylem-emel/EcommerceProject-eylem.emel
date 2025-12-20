import { useDispatch } from "react-redux";
import { logout } from "../store/auth/auth.actions";
import { clearAuthToken } from "../api/axios";

const dispatch = useDispatch();

const handleLogout = () => {
  localStorage.removeItem("token");
  clearAuthToken();
  dispatch(logout());
};
