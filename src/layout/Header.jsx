import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesIfNeeded } from "../store/product.thunks";
import md5 from "blueimp-md5";

import { logoutThunk } from "../store/client.thunks";

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.client.user);

  const categories = useSelector((state) => state.product.categories);
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [q, setQ] = useState("");
  const [shopOpen, setShopOpen] = useState(false);
  const shopRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  // Mega menu: click-toggle + dışarı tıklayınca kapat
  useEffect(() => {
    const handler = (e) => {
      if (!shopRef.current) return;
      if (!shopRef.current.contains(e.target)) setShopOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const normalized = useMemo(() => {
    return safeCategories
      .map((c) => {
        const id = c.id;
        const name = c.title;
        const gender = c.gender === "k" ? "kadin" : c.gender === "e" ? "erkek" : null;

        const codeSlug =
          typeof c.code === "string" && c.code.includes(":") ? c.code.split(":")[1] : null;

        const slug = codeSlug ? slugify(codeSlug) : slugify(name);

        return { id, name, gender, slug };
      })
      .filter((x) => x.id && x.name && (x.gender === "kadin" || x.gender === "erkek"));
  }, [safeCategories]);

  const womenCats = useMemo(() => normalized.filter((c) => c.gender === "kadin"), [normalized]);
  const menCats = useMemo(() => normalized.filter((c) => c.gender === "erkek"), [normalized]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  const avatarUrl = useMemo(() => {
    const email = String(user?.email || "").trim().toLowerCase();
    if (!email) return null;
    const hash = md5(email);
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=64`;
  }, [user]);

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            E
          </div>
          <div className="leading-tight">
            <div className="font-bold">Ecommerce</div>
            <div className="text-xs text-gray-500">demo</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-2 ml-4 relative">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Home
          </NavLink>

          {/* SHOP mega menu */}
          <div className="relative" ref={shopRef}>
            <button
              type="button"
              onClick={() => setShopOpen((v) => !v)}
              className="px-3 py-2 rounded-md text-sm inline-flex items-center gap-1 text-gray-700 hover:bg-gray-100"
            >
              Shop <span className="text-xs">▾</span>
            </button>

            {shopOpen && (
              <div className="absolute left-0 top-full w-[520px] bg-white border rounded-lg shadow-lg p-6 z-[9999] pointer-events-auto">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <div className="font-semibold mb-3">Kadın</div>
                    <div className="space-y-2">
                      {womenCats.map((c) => (
                        <NavLink
                          key={`w-${c.id}`}
                          to={`/shop/kadin/${c.slug}/${c.id}`}
                          className={({ isActive }) =>
                            `block text-sm ${
                              isActive ? "font-semibold underline" : "text-gray-700 hover:underline"
                            }`
                          }
                          onClick={() => setShopOpen(false)}
                        >
                          {c.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-3">Erkek</div>
                    <div className="space-y-2">
                      {menCats.map((c) => (
                        <NavLink
                          key={`m-${c.id}`}
                          to={`/shop/erkek/${c.slug}/${c.id}`}
                          className={({ isActive }) =>
                            `block text-sm ${
                              isActive ? "font-semibold underline" : "text-gray-700 hover:underline"
                            }`
                          }
                          onClick={() => setShopOpen(false)}
                        >
                          {c.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <NavLink
                    to="/shop"
                    className="text-sm text-gray-700 hover:underline"
                    onClick={() => setShopOpen(false)}
                  >
                    Tüm ürünlere git
                  </NavLink>
                  <span className="text-xs text-gray-500">Kategoriler: {normalized.length}</span>
                </div>

                {normalized.length === 0 && (
                  <div className="mt-4 text-xs text-gray-500">
                    Kategoriler yükleniyor / bulunamadı.
                  </div>
                )}
              </div>
            )}
          </div>

          <NavLink
            to="/team"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Team
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex justify-center">
          <div className="w-full max-w-xl flex items-center gap-2 border rounded-lg px-3 py-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="w-full outline-none text-sm"
            />
            <button type="submit" className="text-sm px-3 py-1 rounded-md bg-black text-white">
              Search
            </button>
          </div>
        </form>

        {/* Right */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border" />
              ) : null}

              <div className="text-sm">
                <div className="font-semibold leading-tight">{user?.name || "User"}</div>
                <div className="text-xs text-gray-500 leading-tight">{user?.email}</div>
              </div>

              <button
                type="button"
                onClick={() => dispatch(logoutThunk())}
                className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
