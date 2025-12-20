import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesIfNeeded } from "../store/product.thunks";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const rawProductList = useSelector(
    (state) => state.product.productList
  );

  // 🔒 HER DURUMA KARŞI ARRAY GARANTİSİ
  const productList = Array.isArray(rawProductList)
    ? rawProductList
    : rawProductList?.products || rawProductList?.data || [];

  const [q, setQ] = useState("");

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  const categories = useMemo(() => {
    const map = new Map();

    productList.forEach((p) => {
      const categoryId = p.category_id ?? p.categoryId;
      const categoryName =
        p.categoryName ?? p.category_name ?? p.category;
      const gender = p.gender ?? "all";

      if (!categoryId || !categoryName) return;

      const key = `${gender}-${categoryId}-${categoryName}`;
      if (!map.has(key)) {
        map.set(key, { gender, categoryId, categoryName });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      String(a.categoryName).localeCompare(String(b.categoryName), "tr")
    );
  }, [productList]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">
          Ecommerce
        </Link>

        <nav className="hidden md:flex gap-3">
          <NavLink to="/" className="px-3 py-2">Home</NavLink>
          <NavLink to="/shop" className="px-3 py-2">Shop</NavLink>
          <NavLink to="/about" className="px-3 py-2">About</NavLink>
          <NavLink to="/contact" className="px-3 py-2">Contact</NavLink>
        </nav>

        <form onSubmit={handleSearchSubmit} className="flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </form>

        <div className="hidden md:flex gap-2">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Sign up</NavLink>
        </div>
      </div>

      <div className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
          <NavLink
            to="/shop"
            className="text-xs px-3 py-1 border rounded-full"
          >
            All
          </NavLink>

          {categories.map((c) => (
            <NavLink
              key={`${c.gender}-${c.categoryId}`}
              to={`/shop/${c.gender}/${c.categoryName}/${c.categoryId}`}
              className="text-xs px-3 py-1 border rounded-full"
            >
              {c.categoryName}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
