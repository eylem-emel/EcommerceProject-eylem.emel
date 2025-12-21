import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchCategoriesIfNeeded } from "../store/product.thunks";

export default function Header() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.shoppingCart?.cart || []);
  const categories = useSelector((state) => state.product?.categories || []);

  // Sepet dropdown
  const [openCart, setOpenCart] = useState(false);
  const cartDropdownRef = useRef(null);

  // Shop dropdown (CLICK ile aç/kapat)
  const [openShop, setOpenShop] = useState(false);
  const shopDropdownRef = useRef(null);

  // T12: Header açılınca categories yoksa çek
  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  // Dropdown dışına tıklayınca kapat (Sepet)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!cartDropdownRef.current) return;
      if (!cartDropdownRef.current.contains(e.target)) setOpenCart(false);
    };

    if (openCart) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCart]);

  // Dropdown dışına tıklayınca kapat (Shop)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!shopDropdownRef.current) return;
      if (!shopDropdownRef.current.contains(e.target)) setOpenShop(false);
    };

    if (openShop) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openShop]);

  const { totalCount, totalPrice } = useMemo(() => {
    const totalCountCalc = cart.reduce((sum, item) => sum + (item.count || 0), 0);

    const totalPriceCalc = cart.reduce((sum, item) => {
      const price = Number(item.product?.price) || 0;
      const count = item.count || 0;
      return sum + price * count;
    }, 0);

    return { totalCount: totalCountCalc, totalPrice: totalPriceCalc };
  }, [cart]);

  // Ürün adı alanı farklı olabilir
  const getName = (p) => p?.name || p?.title || "Ürün";

  // Görsel alanı farklı olabilir: images[0] string / images[0].url / image / img
  const getImg = (p) => {
    if (!p) return "";

    const first = Array.isArray(p.images) ? p.images[0] : null;
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && first.url) return first.url;

    if (p.image) return p.image;
    if (p.img) return p.img;

    return "";
  };

  const getPrice = (p) => Number(p?.price) || 0;

  // --- T12 helpers (kategori linkleri) ---
  const parseCategory = (c) => {
    // API örnek: code: "k:tisort", gender: "k", title: "Tişört"
    const code = String(c?.code || "");
    const [gFromCode, nameFromCode] = code.includes(":") ? code.split(":") : ["", ""];
    const gender = c?.gender || gFromCode; // "k" | "e"
    const slug = nameFromCode || (c?.title ? String(c.title).toLowerCase() : "kategori");

    return {
      id: c?.id,
      title: c?.title || slug,
      gender,
      slug,
    };
  };

  const grouped = useMemo(() => {
    const arr = Array.isArray(categories) ? categories : [];
    const parsed = arr.map(parseCategory).filter((x) => x?.id && x?.gender && x?.slug);

    const kadin = parsed.filter((x) => x.gender === "k");
    const erkek = parsed.filter((x) => x.gender === "e");

    // title'a göre sırala
    kadin.sort((a, b) => String(a.title).localeCompare(String(b.title), "tr"));
    erkek.sort((a, b) => String(a.title).localeCompare(String(b.title), "tr"));

    return { kadin, erkek };
  }, [categories]);

  const categoryPath = (gender, slug, id) => {
    const g = gender === "k" ? "kadin" : "erkek";
    return `/shop/${g}/${slug}/${id}`;
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold">
          E-Commerce
        </Link>

        {/* MENÜ */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({ isActive }) => (isActive ? "font-semibold" : "")}>
            Home
          </NavLink>

          {/* T12: SHOP DROPDOWN (CLICK) */}
          <div className="relative" ref={shopDropdownRef}>
            <button
              type="button"
              className="inline-flex items-center gap-1 font-medium"
              onClick={() => setOpenShop((v) => !v)}
            >
              Shop <span className="text-xs">▾</span>
            </button>

            {openShop && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[560px] bg-white border shadow-xl rounded-xl p-6 z-50">
                <div className="grid grid-cols-2 gap-8">
                  {/* Kadın */}
                  <div>
                    <div className="font-semibold mb-3">Kadın</div>
                    <div className="space-y-2">
                      {grouped.kadin.map((c) => (
                        <Link
                          key={c.id}
                          to={categoryPath("k", c.slug, c.id)}
                          className="block text-sm text-gray-700 hover:text-black"
                          onClick={() => setOpenShop(false)}
                        >
                          {c.title}
                        </Link>
                      ))}
                      {grouped.kadin.length === 0 && (
                        <div className="text-sm text-gray-400">Kategori yok</div>
                      )}
                    </div>
                  </div>

                  {/* Erkek */}
                  <div>
                    <div className="font-semibold mb-3">Erkek</div>
                    <div className="space-y-2">
                      {grouped.erkek.map((c) => (
                        <Link
                          key={c.id}
                          to={categoryPath("e", c.slug, c.id)}
                          className="block text-sm text-gray-700 hover:text-black"
                          onClick={() => setOpenShop(false)}
                        >
                          {c.title}
                        </Link>
                      ))}
                      {grouped.erkek.length === 0 && (
                        <div className="text-sm text-gray-400">Kategori yok</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/about" className={({ isActive }) => (isActive ? "font-semibold" : "")}>
            About
          </NavLink>
          <NavLink to="/team" className={({ isActive }) => (isActive ? "font-semibold" : "")}>
            Team
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "font-semibold" : "")}>
            Contact
          </NavLink>
        </nav>

        {/* SAĞ TARAF */}
        <div className="flex items-center gap-6 relative" ref={cartDropdownRef}>
          <NavLink to="/login" className="flex items-center gap-2">
            <span>Hesabım</span>
          </NavLink>

          <NavLink to="/favorites" className="flex items-center gap-2">
            <span>Favorilerim</span>
          </NavLink>

          {/* SEPET */}
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
            <div className="absolute right-0 top-12 w-96 bg-white shadow-xl rounded-xl border p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Sepetim ({cart.length} ürün)</h4>
                <button
                  type="button"
                  onClick={() => setOpenCart(false)}
                  className="text-sm text-gray-500"
                >
                  Kapat
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-gray-500">Sepet boş</p>
              ) : (
                <div className="max-h-72 overflow-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product?.id}
                      className="flex gap-3 py-3 border-b last:border-b-0"
                    >
                      <img
                        src={getImg(item.product)}
                        alt={getName(item.product)}
                        className="w-14 h-14 object-cover rounded-lg bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/56x56.png?text=No+Img";
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {getName(item.product)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Adet: {item.count} • {getPrice(item.product).toFixed(2)} TL
                        </p>
                      </div>

                      <div className="text-sm font-semibold whitespace-nowrap">
                        {(getPrice(item.product) * (item.count || 0)).toFixed(2)} TL
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Toplam</span>
                    <span>{totalPrice.toFixed(2)} TL</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Link
                      to="/cart"
                      className="text-center border rounded-lg py-2 font-medium"
                      onClick={() => setOpenCart(false)}
                    >
                      Sepete Git
                    </Link>

                    <button
                      type="button"
                      className="bg-orange-500 text-white rounded-lg py-2 font-medium"
                    >
                      Siparişi Tamamla
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
