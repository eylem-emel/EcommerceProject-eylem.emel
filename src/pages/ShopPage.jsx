import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { fetchCategoriesIfNeeded, fetchProductsIfNeeded } from "../store/product.thunks";

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
  const products = useSelector((s) => s.product.productList);
  const total = useSelector((s) => s.product.total);
  const fetchState = useSelector((s) => s.product.fetchState);

  const { gender, categoryName, categoryId } = useParams();

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
    // ürünleri her route değişiminde tekrar çekmeyelim, varsa store'dan kullan
    dispatch(fetchProductsIfNeeded());
  }, [dispatch]);

  const isLoading = fetchState === "FETCHING";

  const filteredProducts = useMemo(() => {
    if (!categoryId) return products || [];
    const cid = String(categoryId);

    return (products || []).filter((p) => {
      const pid = p?.category_id ?? p?.categoryId ?? p?.category?.id;
      return pid != null && String(pid) === cid;
    });
  }, [products, categoryId]);

  const linkOf = (cat) => {
    const title = cat?.title ?? cat?.name ?? "kategori";
    return `/shop/${genderSlug(cat?.gender)}/${slugifyTr(title)}/${cat?.id}`;
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Shop</h1>
          <p className="text-sm text-zinc-600 mt-1">
            Kategoriler linktir, tıklayınca şu formatta route’a gider:
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

      {/* Categories */}
      <div className="mt-5 w-full flex flex-wrap gap-2">
        {(categories || []).map((c) => {
          const active = String(c?.id) === String(categoryId);
          const title = c?.title ?? c?.name ?? "Kategori";

          return (
            <Link
              key={c?.id}
              to={linkOf(c)}
              className={[
                "px-3 py-2 rounded-xl border text-sm transition",
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 hover:bg-zinc-50",
              ].join(" ")}
            >
              {title}
            </Link>
          );
        })}

        {(!categories || categories.length === 0) && (
          <div className="text-sm text-zinc-500">
            Kategoriler yükleniyor / bulunamadı.
          </div>
        )}
      </div>

      {/* Products Panel */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 relative">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm font-semibold">Products</div>
            <div className="text-xs text-zinc-600 mt-1">
              API Total: <b>{total}</b> • Shown: <b>{filteredProducts.length}</b>
            </div>
          </div>

          {isLoading && (
            <div className="inline-flex items-center gap-2 text-sm text-zinc-600">
              <span className="inline-block w-4 h-4 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
              Loading products…
            </div>
          )}
        </div>

        {/* overlay spinner */}
        {isLoading && (
          <div className="absolute inset-0 rounded-2xl bg-white/60 flex items-center justify-center">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <span className="inline-block w-5 h-5 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
              <div className="text-sm text-zinc-700">Fetching products…</div>
            </div>
          </div>
        )}

        {!isLoading && fetchState === "FAILED" && (
          <div className="mt-4 text-sm text-red-600">
            Ürünler yüklenemedi. API yanıtını kontrol et.
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.name || p.title || p.product_name || "Untitled"}
              price={p.price != null ? `$${p.price}` : ""}
              images={p.images}
              rating={p.rating}
            />
          ))}
        </div>

        {!isLoading && filteredProducts.length === 0 && fetchState !== "FAILED" && (
          <div className="mt-4 text-sm text-zinc-500">
            Bu kategoride ürün bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
