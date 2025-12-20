import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
  if (v.includes("k") || v.includes("w") || v.includes("f")) return "kadin";
  if (v.includes("e") || v.includes("m")) return "erkek";
  return "kadin"; // fallback
}

export default function HomePage() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.product.categories);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  const top5 = useMemo(() => {
    const arr = [...(categories || [])];
    arr.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    return arr.slice(0, 5);
  }, [categories]);

  const linkOf = (cat) =>
    `/shop/${genderSlug(cat.gender)}/${slugifyTr(cat.title)}/${cat.id}`;

  return (
    <div className="w-full">
      {/* HERO (senin mevcut tasarımın varsa bunu kendi hero'nla değiştirebilirsin) */}
      <section className="w-full bg-sky-500 text-white rounded-2xl overflow-hidden">
        <div className="container mx-auto px-6 py-16">
          <div className="text-sm tracking-widest opacity-90">SUMMER 2025</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-3">
            NEW COLLECTION
          </h1>
          <p className="mt-4 max-w-xl text-white/90">
            En popüler kategorileri keşfet. Rating’e göre ilk 5 kategori aşağıda.
          </p>
          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <section className="container mx-auto px-6 mt-8">
        <div className="w-full rounded-2xl border border-zinc-200 p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">Top Categories</div>
              <div className="text-sm text-zinc-600">
                Rating değerine göre ilk 5
              </div>
            </div>
            <Link to="/shop" className="text-sm underline">
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {top5.map((c) => (
              <Link
                key={c.id}
                to={linkOf(c)}
                className="rounded-2xl border border-zinc-200 overflow-hidden hover:bg-zinc-50 transition"
              >
                {/* image: API img vermezse placeholder */}
                <div className="h-24 bg-zinc-100 flex items-center justify-center text-xs text-zinc-500">
                  {c.img ? (
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>image</span>
                  )}
                </div>

                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">
                    {c.title}
                  </div>
                  <div className="text-xs text-zinc-600 mt-1">
                    rating: {Number(c.rating) || 0}
                  </div>
                </div>
              </Link>
            ))}

            {top5.length === 0 && (
              <div className="text-sm text-zinc-500">
                Kategoriler yükleniyor / bulunamadı.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
