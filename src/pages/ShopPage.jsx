import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../store/product.thunks";
import { setFilter, setLimit, setOffset, setSort } from "../store/product.actions";

export default function ShopPage() {
  const dispatch = useDispatch();
  const { gender, categoryName, categoryId } = useParams();
  const location = useLocation();

  const { productList, fetchState, total, limit, offset, filter, sort } = useSelector(
    (state) => state.product
  );

  const products = Array.isArray(productList) ? productList : [];

  // Header search bar’dan gelen ?search= varsa başlangıç filter’ına bas
  const initialSearch = useMemo(() => {
    const params = new URLSearchParams(location.search || "");
    return (params.get("search") || "").trim();
  }, [location.search]);

  // İlk load: eğer search paramı varsa reducer filter’ına yaz
  useEffect(() => {
    if (!initialSearch) return;
    dispatch(setOffset(0));
    dispatch(setFilter(initialSearch));
  }, [dispatch, initialSearch]);

  const title = useMemo(() => {
    if (gender && categoryName && categoryId) return `Shop • ${gender} • ${categoryName}`;
    return "Shop";
  }, [gender, categoryName, categoryId]);

  // ✅ T14: category/filter/sort/limit/offset değişince otomatik refetch
  // filter için küçük debounce (typing → request spam olmasın)
  const [filterDraft, setFilterDraft] = useState("");
  useEffect(() => {
    setFilterDraft(filter || "");
  }, [filter]);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = {};
      if (categoryId) params.category = Number(categoryId);
      dispatch(fetchProducts(params));
    }, 350);

    return () => clearTimeout(t);
  }, [dispatch, categoryId, filter, sort, limit, offset]);

  // Category değişince sayfa başına dön
  useEffect(() => {
    dispatch(setOffset(0));
  }, [dispatch, categoryId]);

  // Pagination hesapları (T15)
  const totalPages = useMemo(() => {
    const l = Number(limit) || 25;
    const t = Number(total) || 0;
    return Math.max(1, Math.ceil(t / l));
  }, [limit, total]);

  const currentPage = useMemo(() => {
    const l = Number(limit) || 25;
    const o = Number(offset) || 0;
    return Math.floor(o / l) + 1;
  }, [limit, offset]);

  const goToPage = (page) => {
    const l = Number(limit) || 25;
    const p = Math.min(Math.max(1, page), totalPages);
    dispatch(setOffset((p - 1) * l));
  };

  const pageButtons = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [currentPage, totalPages]);

  if (fetchState === "FETCHING" || fetchState === "NOT_FETCHED") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (fetchState === "FAILED") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="text-red-500">Products couldn't be loaded.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">
            Total: {total} • Showing: {products.length}
          </p>
        </div>

        {/* ✅ T14 Filter + Sort UI */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            value={filterDraft}
            onChange={(e) => {
              const v = e.target.value;
              setFilterDraft(v);
              dispatch(setOffset(0));
              dispatch(setFilter(v));
            }}
            placeholder="Filter (e.g. siyah)"
            className="border rounded-lg px-3 py-2 text-sm w-full md:w-[320px]"
          />

          <select
            value={sort || ""}
            onChange={(e) => {
              dispatch(setOffset(0));
              dispatch(setSort(e.target.value));
            }}
            className="border rounded-lg px-3 py-2 text-sm w-full md:w-[220px]"
          >
            <option value="">Sort (select)</option>
            <option value="price:asc">Price: Asc</option>
            <option value="price:desc">Price: Desc</option>
            <option value="rating:asc">Rating: Asc</option>
            <option value="rating:desc">Rating: Desc</option>
          </select>

          {/* limit seçimi (T15) */}
          <select
            value={String(limit)}
            onChange={(e) => {
              const newLimit = Number(e.target.value) || 25;
              dispatch(setLimit(newLimit));
              dispatch(setOffset(0));
            }}
            className="border rounded-lg px-3 py-2 text-sm w-full md:w-[160px]"
          >
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="75">75 / page</option>
          </select>
        </div>
      </div>

      {!products.length ? (
        <div className="text-gray-500">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* ✅ T15 Pagination */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="text-sm text-gray-600">
              Page {currentPage} / {totalPages}
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-2 rounded-md text-sm border disabled:opacity-50"
              >
                Prev
              </button>

              {pageButtons[0] > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goToPage(1)}
                    className="px-3 py-2 rounded-md text-sm border"
                  >
                    1
                  </button>
                  {pageButtons[0] > 2 && <span className="text-gray-400">…</span>}
                </>
              )}

              {pageButtons.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  className={`px-3 py-2 rounded-md text-sm border ${
                    p === currentPage ? "bg-black text-white" : ""
                  }`}
                >
                  {p}
                </button>
              ))}

              {pageButtons[pageButtons.length - 1] < totalPages && (
                <>
                  {pageButtons[pageButtons.length - 1] < totalPages - 1 && (
                    <span className="text-gray-400">…</span>
                  )}
                  <button
                    type="button"
                    onClick={() => goToPage(totalPages)}
                    className="px-3 py-2 rounded-md text-sm border"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-2 rounded-md text-sm border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
