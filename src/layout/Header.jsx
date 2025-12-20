import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesIfNeeded } from "../store/product.thunks";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const rawProductList = useSelector((state) => state.product.productList);

  const productList = Array.isArray(rawProductList)
    ? rawProductList
    : rawProductList?.products ||
      rawProductList?.data ||
      rawProductList?.items ||
      [];

  const [q, setQ] = useState("");
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  // API categoryName göndermiyorsa demo map:
  const CATEGORY_NAME_BY_ID = {
    1: "Bags",
    2: "Belts",
    3: "Cosmetics",
    4: "Hats",
    5: "Shoes",
    6: "T-Shirts",
    7: "Jackets",
    8: "Pants",
  };

  // Kadın / Erkek kategorilerini ayrı listeleyelim
  const { womenCats, menCats } = useMemo(() => {
    const womenMap = new Map();
    const menMap = new Map();

    productList.forEach((p) => {
      const genderRaw = (p.gender ?? "").toString().toLowerCase();
      const gender =
        genderRaw.includes("kadin") || genderRaw.includes("women")
          ? "kadin"
          : genderRaw.includes("erkek") || genderRaw.includes("men")
          ? "erkek"
          : null;

      const categoryId = p.category_id ?? p.categoryId;
      const categoryNameRaw =
        p.categoryName ??
        p.category_name ??
        p.category ??
        CATEGORY_NAME_BY_ID[categoryId];

      const categoryName = categoryNameRaw ? String(categoryNameRaw) : null;

      if (!gender || !categoryId || !categoryName) return;

      const key = `${categoryId}-${categoryName}`;

      if (gender === "kadin") {
        if (!womenMap.has(key)) womenMap.set(key, { gender, categoryId, categoryName });
      } else {
        if (!menMap.has(key)) menMap.set(key, { gender, categoryId, categoryName });
      }
    });

    const sortFn = (a, b) =>
      String(a.categoryName).localeCompare(String(b.categoryName), "en");

    return {
      womenCats: Array.from(womenMap.values()).sort(sortFn),
      menCats: Array.from(menMap.values()).sort(sortFn),
    };
  }, [productList]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

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
              Shop
              <span className="text-xs">▾</span>
            </NavLink>

            {shopOpen && (
              <div className="absolute left-0 top-full mt-2 w-[520px] bg-white border rounded-lg shadow-lg p-6 z-50">
                <div className="grid grid-cols-2 gap-10">
                  {/* Kadın */}
                  <div>
                    <div className="font-semibold mb-3">Kadın</div>
                    <div className="space-y-2">
                      {(womenCats.length ? womenCats : Object.entries(CATEGORY_NAME_BY_ID).map(([id, name]) => ({
                        gender: "kadin",
                        categoryId: Number(id),
                        categoryName: name,
                      }))).slice(0, 8).map((c) => (
                        <Link
                          key={`w-${c.categoryId}-${c.categoryName}`}
                          to={`/shop/${c.gender}/${c.categoryName}/${c.categoryId}`}
                          className="block text-sm text-gray-700 hover:underline"
                          onClick={() => setShopOpen(false)}
                        >
                          {c.categoryName}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Erkek */}
                  <div>
                    <div className="font-semibold mb-3">Erkek</div>
                    <div className="space-y-2">
                      {(menCats.length ? menCats : Object.entries(CATEGORY_NAME_BY_ID).map(([id, name]) => ({
                        gender: "erkek",
                        categoryId: Number(id),
                        categoryName: name,
                      }))).slice(0, 8).map((c) => (
                        <Link
                          key={`m-${c.categoryId}-${c.categoryName}`}
                          to={`/shop/${c.gender}/${c.categoryName}/${c.categoryId}`}
                          className="block text-sm text-gray-700 hover:underline"
                          onClick={() => setShopOpen(false)}
                        >
                          {c.categoryName}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
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
          <NavLink to="/login" className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
            Login
          </NavLink>
          <NavLink to="/signup" className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
            Sign up
          </NavLink>
        </div>
      </div>
    </header>
  );
}
