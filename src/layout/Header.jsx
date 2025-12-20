import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesIfNeeded } from "../store/product.thunks";

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
  // API tarafında kadın için "kadin", "women", "w" vs gelebilir
  if (v.includes("k") || v.includes("w") || v.includes("f")) return "kadin";
  if (v.includes("e") || v.includes("m")) return "erkek";
  return "kadin";
}

export default function Header() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.product.categories);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  const { womenCats, menCats } = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];

    const women = [];
    const men = [];

    for (const c of list) {
      const g = genderSlug(c?.gender);
      if (g === "erkek") men.push(c);
      else women.push(c);
    }

    // İstersen alfabetik sırala:
    women.sort((a, b) => String(a?.title ?? "").localeCompare(String(b?.title ?? ""), "tr"));
    men.sort((a, b) => String(a?.title ?? "").localeCompare(String(b?.title ?? ""), "tr"));

    return { womenCats: women, menCats: men };
  }, [categories]);

  const toShop = (c) => {
    const g = genderSlug(c?.gender);
    const name = slugifyTr(c?.title ?? c?.name ?? "kategori");
    return `/shop/${g}/${name}/${c?.id}`;
  };

  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-extrabold text-lg">
          E-Commerce
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-semibold text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
            }
          >
            Home
          </NavLink>

          {/* SHOP + DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                (isActive ? "font-semibold text-zinc-900" : "text-zinc-600 hover:text-zinc-900") +
                " inline-flex items-center gap-1"
              }
            >
              Shop
              <span className="text-xs">▾</span>
            </NavLink>

            {/* Dropdown */}
            {open && (
              <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+14px)] z-50 w-[520px] rounded-2xl border border-zinc-200 bg-white shadow-lg p-6">
                <div className="grid grid-cols-2 gap-10">
                  {/* Kadın */}
                  <div>
                    <div className="font-semibold text-zinc-900 mb-3">Kadın</div>
                    <div className="flex flex-col gap-2">
                      {womenCats.length === 0 ? (
                        <span className="text-sm text-zinc-500">Kategori yok</span>
                      ) : (
                        womenCats.map((c) => (
                          <Link
                            key={c.id}
                            to={toShop(c)}
                            className="text-sm text-zinc-600 hover:text-zinc-900"
                            onClick={() => setOpen(false)}
                          >
                            {c.title}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Erkek */}
                  <div>
                    <div className="font-semibold text-zinc-900 mb-3">Erkek</div>
                    <div className="flex flex-col gap-2">
                      {menCats.length === 0 ? (
                        <span className="text-sm text-zinc-500">Kategori yok</span>
                      ) : (
                        menCats.map((c) => (
                          <Link
                            key={c.id}
                            to={toShop(c)}
                            className="text-sm text-zinc-600 hover:text-zinc-900"
                            onClick={() => setOpen(false)}
                          >
                            {c.title}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "font-semibold text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/team"
            className={({ isActive }) =>
              isActive ? "font-semibold text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
            }
          >
            Team
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "font-semibold text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
            }
          >
            Contact
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "font-semibold text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive ? "font-semibold text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
            }
          >
            Signup
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
