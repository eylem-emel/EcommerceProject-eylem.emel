import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Header() {
  const cart = useSelector((state) => state.shoppingCart?.cart || []);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
          <NavLink to="/shop" className={({ isActive }) => (isActive ? "font-semibold" : "")}>
            Shop
          </NavLink>
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
        <div className="flex items-center gap-6 relative" ref={dropdownRef}>
          <NavLink to="/login" className="flex items-center gap-2">
            <span>Hesabım</span>
          </NavLink>

          <NavLink to="/favorites" className="flex items-center gap-2">
            <span>Favorilerim</span>
          </NavLink>

          {/* SEPET */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative flex items-center gap-2"
          >
            <span>Sepetim</span>
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-12 w-96 bg-white shadow-xl rounded-xl border p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Sepetim ({cart.length} ürün)</h4>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
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
                      onClick={() => setOpen(false)}
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
