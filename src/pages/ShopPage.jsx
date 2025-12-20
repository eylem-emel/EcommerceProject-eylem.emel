import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { fetchCategoriesIfNeeded, fetchProducts } from "../store/product.thunks";

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

function genderSlug(gender) {
  const g = String(gender || "").toLowerCase();
  if (g === "kadin" || g === "kadın" || g === "women") return "kadin";
  if (g === "erkek" || g === "men") return "erkek";
  return "kadin";
}

export default function ShopPage() {
  const dispatch = useDispatch();
  const { gender, categoryName, categoryId } = useParams();

  const categories = useSelector((s) => s.product.categories);
  const products = useSelector((s) => s.product.productList);
  const total = useSelector((s) => s.product.total);
  const fetchState = useSelector((s) => s.product.fetchState);

  // T14 states
  const [filter, setFilter] = useState("");
  const [sortDraft, setSortDraft] = useState("");
  const [sort, setSort] = useState("");

  // categories
  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  // products fetch (T14)
  useEffect(() => {
    const params = {};
    if (categoryId) params.category = Number(categoryId);
    if (filter.trim()) params.filter = filter.trim();
    if (sort) params.sort = sort;

    dispatch(fetchProducts(params));
  }, [dispatch, categoryId, filter, sort]);

  const isLoading = fetchState === "FETCHING";
  const isFailed = fetchState === "FAILED";

  const selectedCategoryTitle = useMemo(() => {
    const titleFromUrl = categoryName ? String(categoryName).replaceAll("-", " ") : "";
    const found = (categories || []).find((c) => String(c.id) === String(categoryId));
    const titleFromStore = found?.title ?? found?.name ?? "";
    return titleFromStore || titleFromUrl || "All products";
  }, [categories, categoryId, categoryName]);

  const top5 = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return [...list]
      .sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0))
      .slice(0, 5);
  }, [categories]);

  const linkOf = (cat) => {
    const title = cat?.title ?? cat?.name ?? "kategori";
    return `/shop/${genderSlug(cat?.gender)}/${slugifyTr(title)}/${cat?.id}`;
  };

  const applySort = () => {
    setSort(sortDraft); // requirement: sort sadece Filter butonuyla apply
  };

  const clearAll = () => {
    setFilter("");
    setSortDraft("");
    setSort("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-bold tracking-tight text-zinc-900">Shop</div>
          <div className="text-sm text-zinc-600 mt-1">
            {gender ? <span className="capitalize">{gender}</span> : <span>All</span>}
            {categoryId ? (
              <>
                <span className="mx-2 text-zinc-300">/</span>
                <span className="capitalize">{selectedCategoryTitle}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-600">Sort</label>
            <select
              value={sortDraft}
              onChange={(e) => setSortDraft(e.target.value)}
              className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="">—</option>
              <option value="price:asc">price:asc</option>
              <option value="price:desc">price:desc</option>
              <option value="rating:asc">rating:asc</option>
              <option value="rating:desc">rating:desc</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-600">Filter</label>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="örn: siyah"
              className="h-9 w-56 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <button
            onClick={applySort}
            className="h-9 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Filter
          </button>

          <button
            onClick={clearAll}
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-zinc-900">Top categories</div>
          <Link to="/shop" className="text-xs font-semibold text-orange-600 hover:text-orange-700">
            Reset category
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(top5 || []).map((c) => (
            <Link
              key={c.id}
              to={linkOf(c)}
              className="group rounded-2xl border border-zinc-200 bg-white p-3 hover:shadow-sm transition"
            >
              <div className="aspect-[4/3] rounded-xl bg-zinc-100 overflow-hidden">
                {c?.img ? (
                  <img
                    src={c.img}
                    alt={c?.title ?? c?.name ?? "category"}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-xs text-zinc-500">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-zinc-900 truncate">
                  {c?.title ?? c?.name}
                </div>
                <div className="text-xs text-zinc-500">{(Number(c?.rating) || 0).toFixed(1)}</div>
              </div>

              <div className="text-xs text-zinc-500 mt-1 capitalize">{genderSlug(c?.gender)}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 relative">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm font-semibold">Products</div>
            <div className="text-xs text-zinc-600 mt-1">
              {categoryId ? (
                <>
                  Category: <span className="font-semibold text-zinc-900">#{categoryId}</span>
                </>
              ) : (
                <>All categories</>
              )}

              {sort ? (
                <>
                  <span className="mx-2 text-zinc-300">•</span>
                  Sort: <span className="font-semibold text-zinc-900">{sort}</span>
                </>
              ) : null}

              {filter.trim() ? (
                <>
                  <span className="mx-2 text-zinc-300">•</span>
                  Filter: <span className="font-semibold text-zinc-900">“{filter.trim()}”</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="text-xs text-zinc-500">
            Total: <span className="font-semibold text-zinc-900">{total}</span>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] grid place-items-center rounded-2xl">
            <div className="text-sm text-zinc-700">Loading...</div>
          </div>
        )}

        {isFailed && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Ürünler yüklenemedi. API / bağlantıyı kontrol et.
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(products || []).map((p) => (
            <ProductCard key={p.id} id={p.id} title={p?.title ?? p?.name} price={p?.price} />
          ))}
        </div>

        {!isLoading && !isFailed && (!products || products.length === 0) && (
          <div className="mt-4 text-sm text-zinc-500">Ürün bulunamadı.</div>
        )}
      </div>
    </div>
  );
}
