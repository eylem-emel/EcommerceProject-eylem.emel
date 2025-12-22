import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// React Router v6 için basit Protected Route
export default function ProtectedRoute({ children }) {
  const user = useSelector((s) => s.client?.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
