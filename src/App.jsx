import { Switch, Route, Redirect } from "./routerCompat";
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
        <Switch>
          <Route exact path="/" component={HomePage} />

          {/* SHOP */}
          <Route
            path="/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId"
            component={ProductDetailPage}
          />
          <Route
            path="/shop/:gender/:categoryName/:categoryId"
            component={ShopPage}
          />
          <Route exact path="/shop" component={ShopPage} />

          {/* (opsiyonel) eski detail route */}
          <Route path="/product/:productId" component={ProductDetailPage} />

          {/* STATIC */}
          <Route path="/contact" component={ContactPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/login" component={LoginPage} />

          {/* CART */}
          <Route path="/cart" component={CartPage} />

          {/* CHECKOUT */}
          <ProtectedRoute path="/create-order" component={CreateOrderPage} />

          {/* eski /order path kırılmasın -> /create-order'a gönder */}
          <Route path="/order" render={() => <Redirect to="/create-order" />} />

          {/* ORDERS */}
          <ProtectedRoute path="/orders" component={PreviousOrdersPage} />

          {/* 404 */}
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </PageContent>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
