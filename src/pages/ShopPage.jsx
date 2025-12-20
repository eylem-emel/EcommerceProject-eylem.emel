import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
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
  return "kadin";
}

export default function ShopPage() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.product.categories);

  const { gender, categoryName, categoryId } = useParams();

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  const linkOf = (cat) =>
    `/shop/${genderSlug(cat.gender)}/${slugifyTr(cat.title)}/${cat.id}`;

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Shop</h1>
          <p className="text-sm text-zinc-600 mt-1">
            Kategoriler listelenir, tıklayınca route şu formatta gider:
            <span className="font-mono ml-2 text-zinc-700">
              /shop/:gender/:categoryName/:categoryId
            </span>
          </p>
        </div>

        {gender && categoryId && (
          <div className="text-sm text-zinc-600">
            Seçili:
            <span className="ml-2 px-2 py-1 rounded-lg border border-zinc-200 bg-white">
              <b>{gender}</b> / <b>{categoryName}</b> / <b>{categoryId}</b>
            </span>
          </div>
        )}
      </div>

      {/* Category chips */}
      <div className="mt-5 w-full flex flex-wrap gap-2">
        {(categories || []).map((c) => {
          const active = String(c.id) === String(categoryId);
          return (
            <Link
              key={c.id}
              to={linkOf(c)}
              className={[
                "px-3 py-2 rounded-xl border text-sm transition",
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 hover:bg-zinc-50",
              ].join(" ")}
            >
              {c.title}
            </Link>
          );
        })}

        {(!categories || categories.length === 0) && (
          <div className="text-sm text-zinc-500">
            Kategoriler yükleniyor / bulunamadı.
          </div>
        )}
      </div>

      {/* Placeholder content for products */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="text-sm font-semibold">Products Area (placeholder)</div>
        <p className="text-sm text-zinc-600 mt-2">
          T12’de ana hedef: kategorileri çekmek, ekranda göstermek ve route’a
          yönlendirmek. Ürün listeleme kısmı sonraki tasklerde detaylanacak.
        </p>
      </div>
    </div>
  );
}
