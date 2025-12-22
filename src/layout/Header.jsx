import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchCategoriesIfNeeded } from "../store/product.thunks";
import { logoutThunk } from "../store/client.thunks";
import { md5 } from "../utils/md5";

export default function Header() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.shoppingCart?.cart || []);
  const categories = useSelector((state) => state.product?.categories || []);
  const user = useSelector((state) => state.client?.user);

  const avatarUrl = useMemo(() => {
    const email = user?.email?.trim().toLowerCase();
    if (!email) return "https://www.gravatar.com/avatar/?d=mp&s=64";
    return `https://www.gravatar.com/avatar/${md5(email)}?d=mp&s=64`;
  }, [user?.email]);

  // Sepet dropdown
  const [openCart, setOpenCart] = useState(false);
  const cartDropdownRef = useRef(null);

  // User dropdown
  const [openUser, setOpenUser] = useState(false);
  const userDropdownRef = useRef(null);

  const totalCount = useMemo(
    () => cart.reduce((acc, item) => acc + (item?.count || 0), 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (acc, item) => acc + (item?.count || 0) * (item?.product?.price || 0),
        0
      ),
    [cart]
  );

  // T12: Header açılınca categories yoksa çek
  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(e.target)
      ) {
        setOpenCart(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Header dropdown categories (Kadın/Erkek)
  const womenCategories = useMemo(
    () => categories.filter((c) => c.gender === "k"),
    [categories]
  );
  const menCategories = useMemo(
    () => categories.filter((c) => c.gender === "e"),
    [categories]
  );

  const slugifyTr = (text = "") =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replaceAll("ğ", "g")
      .replaceAll("ü", "u")
      .replaceAll("ş", "s")
      .replaceAll("ı", "i")
      .replaceAll("ö", "o")
      .replaceAll("ç", "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const goShopByCategory = (gender, category) => {
    const genderSlug = gender === "k" ? "kadin" : "erkek";
    const categoryNameSlug = slugifyTr(category.title);
    return `/shop/${genderSlug}/${categoryNameSlug}/${category.id}`;
  };

  const handleLogout = () => {
    dispatch(logoutThunk());
    setOpenUser(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl">
          E-Comm
        </Link>

        {/* Menü */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-semibold text-orange-600" : "hover:text-orange-600"
            }
          >
            Anasayfa
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "font-semibold text-orange-600" : "hover:text-orange-600"
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "font-semibold text-orange-600" : "hover:text-orange-600"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/team"
            className={({ isActive }) =>
              isActive ? "font-semibold text-orange-600" : "hover:text-orange-600"
            }
          >
            Team
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "font-semibold text-orange-600" : "hover:text-orange-600"
            }
          >
            Contact
          </NavLink>

          {/* Kadın / Erkek dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="hover:text-orange-600 flex items-center gap-2"
            >
              Kategoriler <span className="text-xs">▾</span>
            </button>

            <div className="hidden group-hover:block absolute left-0 top-7 bg-white border shadow-xl rounded-xl p-4 w-[520px]">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="font-semibold mb-2">Kadın</div>
                  <div className="space-y-1">
                    {womenCategories.map((c) => (
                      <Link
                        key={c.id}
                        to={goShopByCategory("k", c)}
                        className="block px-2 py-1 rounded hover:bg-gray-50"
                      >
                        {c.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-semibold mb-2">Erkek</div>
                  <div className="space-y-1">
                    {menCategories.map((c) => (
                      <Link
                        key={c.id}
                        to={goShopByCategory("e", c)}
                        className="block px-2 py-1 rounded hover:bg-gray-50"
                      >
                        {c.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Sağ taraf */}
        <div className="flex items-center gap-4">
          {/* USER */}
          <div className="relative" ref={userDropdownRef}>
            {user ? (
              <button
                type="button"
                onClick={() => setOpenUser((v) => !v)}
                className="flex items-center gap-2"
              >
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                  referrerPolicy="no-referrer"
                />
                <span className="text-sm font-medium">{user.name || user.email}</span>
                <span className="text-xs">▾</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="px-3 py-1 rounded-lg border hover:bg-gray-50 text-sm"
                >
                  Giriş Yap
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-3 py-1 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600"
                >
                  Üye Ol
                </NavLink>
              </div>
            )}

            {user && openUser && (
              <div className="absolute right-0 top-10 w-56 bg-white border shadow-xl rounded-xl p-2 z-50">
                <Link
                  to="/orders"
                  onClick={() => setOpenUser(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Siparişlerim
                </Link>

                <Link
                  to="/create-order"
                  onClick={() => setOpenUser(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Siparişi Tamamla
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-red-600"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>

          {/* SEPET */}
          <div className="relative" ref={cartDropdownRef}>
            <button
              type="button"
              onClick={() => setOpenCart((v) => !v)}
              className="relative flex items-center gap-2"
            >
              <span>Sepetim</span>
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            </button>

            {/* CART DROPDOWN */}
            {openCart && (
              <div className="absolute right-0 top-10 w-96 bg-white border shadow-xl rounded-xl p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">Sepet</div>
                  <Link
                    to="/cart"
                    onClick={() => setOpenCart(false)}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    Sepete Git
                  </Link>
                </div>

                {cart.length === 0 ? (
                  <div className="text-sm text-gray-500">Sepetiniz boş.</div>
                ) : (
                  <>
                    <div className="max-h-64 overflow-auto space-y-3 pr-2">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-3 border rounded-xl p-2"
                        >
                          <img
                            src={
                              item.product.images?.[0]?.url ||
                              "https://via.placeholder.com/80"
                            }
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium line-clamp-1">
                              {item.product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Adet: {item.count}
                            </div>
                          </div>
                          <div className="text-sm font-semibold">
                            {(item.count * item.product.price).toFixed(2)} ₺
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 border-t pt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-600">Toplam</div>
                      <div className="font-semibold">
                        {totalPrice.toFixed(2)} ₺
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        to="/cart"
                        className="flex-1 text-center px-4 py-2 rounded-xl border hover:bg-gray-50"
                        onClick={() => setOpenCart(false)}
                      >
                        Sepeti Gör
                      </Link>
                      <Link
                        to="/create-order"
                        className="flex-1 text-center px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                        onClick={() => setOpenCart(false)}
                      >
                        Siparişi Tamamla
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
