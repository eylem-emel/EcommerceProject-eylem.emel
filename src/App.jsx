import SignupPage from "./pages/SignupPage";
import { Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import PageContent from "./layout/PageContent";
import Footer from "./layout/Footer";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from "./pages/ContactPage";
import TeamPage from "./pages/TeamPage";
import AboutPage from "./pages/AboutPage";



export default function App() {
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
        </Routes>
      </PageContent>

      <Footer />
    </div>
  );
}
