import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesIfNeeded } from "../store/product.thunks";

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

  const categories = useSelector((state) => state.product.categories);
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [q, setQ] = useState("");
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  // ✅ API gerçek shape:
  // { id, code: "k:ayakkabi", title: "Ayakkabı", img, rating, gender: "k" }
  const normalized = useMemo(() => {
    return safeCategories
      .map((c) => {
        const id = c.id;
        const name = c.title; // ✅
        const gender = c.gender === "k" ? "kadin" : c.gender === "e" ? "erkek" : null;

        // slug için en sağlam kaynak: code içindeki 2. parça
        // "k:ayakkabi" => "ayakkabi"
        const codeSlug = typeof c.code === "string" && c.code.includes(":")
          ? c.code.split(":")[1]
          : null;

        const slug = codeSlug ? slugify(codeSlug) : slugify(name);

        return { id, name, gender, slug };
      })
      .filter((x) => x.id && x.name && (x.gender === "kadin" || x.gender === "erkek"));
  }, [safeCategories]);

  const womenCats = useMemo(
    () => normalized.filter((c) => c.gender === "kadin"),
    [normalized]
  );
  const menCats = useMemo(
    () => normalized.filter((c) => c.gender === "erkek"),
    [normalized]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            E
          </div>
          <div className="leading-tight">
            <div className="font-bold">Ecommerce</div>
            <div className="text-xs text-gray-500">demo</div>
          </div>
        </Link>

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
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm inline-flex items-center gap-1 ${
                  isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Shop <span className="text-xs">▾</span>
            </NavLink>

            {shopOpen && (
              <div className="absolute left-0 top-full mt-2 w-[520px] bg-white border rounded-lg shadow-lg p-6 z-50">
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
                              isActive
                                ? "font-semibold underline"
                                : "text-gray-700 hover:underline"
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
                              isActive
                                ? "font-semibold underline"
                                : "text-gray-700 hover:underline"
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

        <div className="hidden md:flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
}
