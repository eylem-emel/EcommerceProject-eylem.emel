import { useEffect, useMemo } from "react";
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

  const backendFilter = useMemo(() => {
    const q = (searchParams.get("search") || "").trim();
    return q;
  }, [searchParams]);

  useEffect(() => {
    const params = {};
    if (categoryId) params.category = Number(categoryId);
    if (backendFilter) params.filter = backendFilter;

    dispatch(fetchProducts(params));
  }, [dispatch, categoryId, backendFilter]);

  const title = useMemo(() => {
    if (gender && categoryName && categoryId) return `Shop • ${gender} • ${categoryName}`;
    return "Shop";
  }, [gender, categoryName, categoryId]);

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
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{products.length} ürün</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
