import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../store/product.thunks";

export default function ShopPage() {
  const dispatch = useDispatch();
  const { gender, categoryName, categoryId } = useParams();
  const [searchParams] = useSearchParams();

  const { productList, fetchState } = useSelector((state) => state.product);
  const products = Array.isArray(productList) ? productList : [];

  // UI state (T14)
  const [filterText, setFilterText] = useState("");
  const [sortValue, setSortValue] = useState("");

  // Header search bar’dan gelen ?search= varsa başlangıç filter’ına bas
  const initialSearch = useMemo(() => {
    return (searchParams.get("search") || "").trim();
  }, [searchParams]);

  useEffect(() => {
    if (initialSearch) setFilterText(initialSearch);
  }, [initialSearch]);

  const title = useMemo(() => {
    if (gender && categoryName && categoryId) return `Shop • ${gender} • ${categoryName}`;
    return "Shop";
  }, [gender, categoryName, categoryId]);

  const runFetch = () => {
    const params = {};
    if (categoryId) params.category = Number(categoryId);
    if (filterText.trim()) params.filter = filterText.trim();
    if (sortValue) params.sort = sortValue;

    dispatch(fetchProducts(params));
  };

  // İlk girişte ürünleri çek (categoryId varsa ona göre)
  useEffect(() => {
    runFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  if (fetchState === "FETCHING" || fetchState === "NOT_FETCHED") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (fetchState === "FAILED") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="text-red-500">Ürünler yüklenemedi.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{products.length} ürün</p>
        </div>

        {/* ✅ T14 Filter + Sort UI */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filtrele (örn: siyah)"
            className="border rounded-lg px-3 py-2 text-sm w-full md:w-[320px]"
          />

          <select
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full md:w-[220px]"
          >
            <option value="">Sırala (seçiniz)</option>
            <option value="price:asc">Fiyat: Artan</option>
            <option value="price:desc">Fiyat: Azalan</option>
            <option value="rating:asc">Rating: Artan</option>
            <option value="rating:desc">Rating: Azalan</option>
          </select>

          <button
            onClick={runFetch}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm w-full md:w-auto"
          >
            Uygula
          </button>
        </div>
      </div>

      {!products.length ? (
        <div className="text-gray-500">Ürün bulunamadı.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
