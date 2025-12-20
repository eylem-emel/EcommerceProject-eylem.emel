import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchCategoriesIfNeeded } from "../store/product.thunks";

export default function ShopPage() {
  const dispatch = useDispatch();
  const { gender, categoryId } = useParams();
  const [searchParams] = useSearchParams();

  const rawProductList = useSelector((state) => state.product.productList);

  // her koşulda array garanti
  const products = Array.isArray(rawProductList)
    ? rawProductList
    : rawProductList?.products ||
      rawProductList?.data ||
      rawProductList?.items ||
      [];

  useEffect(() => {
    // shop açılınca listeyi garanti çek
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = (searchParams.get("search") || "").trim().toLowerCase();

    let list = [...products];

    // 1) gender filtresi (kadin/erkek)
    if (gender) {
      const g = gender.toLowerCase();
      list = list.filter((p) => {
        const pg = (p.gender || "").toString().toLowerCase();
        // hem "kadin/erkek" hem "women/men" uyumu
        if (g === "kadin") return pg.includes("kadin") || pg.includes("women");
        if (g === "erkek") return pg.includes("erkek") || pg.includes("men");
        return true;
      });
    }

    // 2) category filtresi
    if (categoryId) {
      const cid = Number(categoryId);
      list = list.filter((p) => Number(p.category_id ?? p.categoryId) === cid);
    }

    // 3) search filtresi (?search=)
    if (q) {
      list = list.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }

    return list;
  }, [products, gender, categoryId, searchParams]);

  // Başlık için küçük yardımcı
  const title = useMemo(() => {
    if (gender && categoryId) return `Shop • ${gender} • #${categoryId}`;
    if (gender) return `Shop • ${gender}`;
    if (categoryId) return `Shop • Category #${categoryId}`;
    return "Shop";
  }, [gender, categoryId]);

  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-500">Ürünler yükleniyor / bulunamadı.</p>
      </div>
    );
  }

  if (!filtered || filtered.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-500">
          Bu filtrelere uygun ürün bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{filtered.length} ürün</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
