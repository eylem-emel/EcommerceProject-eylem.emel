// src/pages/CreateOrderPage.jsx

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function CreateOrderPage() {
  const user = useSelector((state) => state.client.user);

  // Kullanıcı login değilse → login sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Outlet />
    </div>
  );
}
