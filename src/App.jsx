import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./layout/Header";
import PageContent from "./layout/PageContent";
import Footer from "./layout/Footer";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from "./pages/ContactPage";
import TeamPage from "./pages/TeamPage";
import AboutPage from "./pages/AboutPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import PreviousOrdersPage from "./pages/PreviousOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { verifyTokenThunk } from "./store/client.thunks";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyTokenThunk());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <PageContent>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* SHOP */}
          <Route path="/shop" element={<ShopPage />} />
          <Route
            path="/shop/:gender/:categoryName/:categoryId"
            element={<ShopPage />}
          />
          <Route
            path="/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId"
            element={<ProductDetailPage />}
          />

          {/* (opsiyonel) eski detail route */}
          <Route path="/product/:productId" element={<ProductDetailPage />} />

          {/* STATIC */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* CART */}
          <Route path="/cart" element={<CartPage />} />

          {/* CHECKOUT */}
          <Route
            path="/create-order"
            element={
              <ProtectedRoute>
                <CreateOrderPage />
              </ProtectedRoute>
            }
          />

          {/* eski /order path kırılmasın -> /create-order'a gönder */}
          <Route path="/order" element={<Navigate to="/create-order" replace />} />

          {/* ORDERS */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <PreviousOrdersPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageContent>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
