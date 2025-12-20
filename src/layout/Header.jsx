import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import md5 from "blueimp-md5";

import { clearUser } from "../store/client.actions";
import { fetchCategoriesIfNeeded } from "../store/product.thunks";
import { clearAuthToken } from "../api/axios";

function slugifyTr(text = "") {
  return String(text)
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
}

function genderSlug(g) {
  const v = String(g || "").toLowerCase();
  if (v.includes("k") || v.includes("w") || v.includes("f")) return "kadin";
  if (v.includes("e") || v.includes("m")) return "erkek";
  return "kadin";
}

export default function Header() {
  const user = useSelector((state) => state.client.user);
  const categoriesRaw = useSelector((state) => state.product.categories);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  // ✅ her koşulda array garanti
  const categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];

  const grouped = useMemo(() => {
    const women = [];
    const men = [];

    categories.forEach((c) => {
      const g = genderSlug(c.gender || c?.code || c?.title);
      if (g === "kadin") women.push(c);
      else men.push(c);
    });

    women.sort((a, b) => String(a.title).localeCompare(String(b.title), "tr"));
    men.sort((a, b) => String(a.title).localeCompare(String(b.title), "tr"));

    return { women, men };
  }, [categories]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearAuthToken();
    dispatch(clearUser());
    navigate("/");
  };

  const linkOf = (cat) => {
    const g = genderSlug(cat.gender);
    const name = slugifyTr(cat.title);
    return `/shop/${g}/${name}/${cat.id}`;
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="text-xl font-bold">
          E-Commerce
        </Link>

        <nav className="flex gap-6 items-center">
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1"
              onClick={() => setOpen((s) => !s)}
            >
              <span>Shop</span>
              <span className="text-xs">▾</span>
            </button>

            {open && (
              <div className="absolute left-0 top-full mt-3 w-[520px] rounded-2xl border border-zinc-200 bg-white shadow-xl p-5 z-50">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-semibold mb-3">Kadın</div>
                    <div className="flex flex-col gap-2">
                      {grouped.women.map((cat) => (
                        <Link
                          key={cat.id}
                          to={linkOf(cat)}
                          className="text-sm text-zinc-700 hover:text-zinc-900"
                        >
                          {cat.title}
                        </Link>
                      ))}
                      {grouped.women.length === 0 && (
                        <div className="text-sm text-zinc-400">Kategori yok</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold mb-3">Erkek</div>
                    <div className="flex flex-col gap-2">
                      {grouped.men.map((cat) => (
                        <Link
                          key={cat.id}
                          to={linkOf(cat)}
                          className="text-sm text-zinc-700 hover:text-zinc-900"
                        >
                          {cat.title}
                        </Link>
                      ))}
                      {grouped.men.length === 0 && (
                        <div className="text-sm text-zinc-400">Kategori yok</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/about">About</Link>
          <Link to="/team">Team</Link>
          <Link to="/contact">Contact</Link>

          {!user ? (
            <>
              <Link
                to="/login"
                state={{ from: location.pathname + location.search }}
                className="font-medium"
              >
                Login
              </Link>
              <Link to="/signup" className="font-medium">
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={`https://www.gravatar.com/avatar/${md5(
                  user.email.trim().toLowerCase()
                )}?s=40&d=identicon`}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
