import { Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

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

import { verifyTokenThunk } from "./store/auth/auth.thunks";

export default function App() {
  const dispatch = useDispatch();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      dispatch(verifyTokenThunk());
      hasRun.current = true;
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <PageContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shop/:gender/:categoryName/:categoryId" element={<ShopPage />} />
        </Routes>
      </PageContent>

      <Footer />
    </div>
  );
}
