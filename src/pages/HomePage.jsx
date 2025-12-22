import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import HeroSlider from "../components/HeroSlider";
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

// Backend: gender "k" (kadın) / "e" (erkek)
function genderSlugFromApi(gender) {
  return String(gender).toLowerCase() === "e" ? "erkek" : "kadin";
}

// Bazı img url'lerinde boşluk olabiliyor: "onrender.com /assets..."
function safeImg(url = "") {
  return String(url).replace(/\s+/g, "");
}

export default function HomePage() {
  const dispatch = useDispatch();
  const categoriesRaw = useSelector((s) => s.product.categories);
  const productList = useSelector((s) => s.product.productList);
  const productFetchState = useSelector((s) => s.product.fetchState);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
    dispatch(fetchProducts({ limit: 8, offset: 0 }));
  }, [dispatch]);

  // her koşulda array garanti
  const categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
  const products = Array.isArray(productList) ? productList : [];

  const top5 = useMemo(() => {
    const arr = [...categories];
    arr.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    return arr.slice(0, 5);
  }, [categories]);

  const linkOf = (cat) =>
    `/shop/${genderSlugFromApi(cat.gender)}/${slugifyTr(cat.title)}/${cat.id}`;

  const featured = useMemo(() => products.slice(0, 8), [products]);

  return (
    <div className="w-full">
      {/* HERO SLIDER */}
      <section className="mb-8">
        <HeroSlider />
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
            {top5.map((c) => {
              const imgUrl = safeImg(c.img);

              return (
                <Link
                  key={c.id}
                  to={linkOf(c)}
                  className="rounded-2xl border border-zinc-200 overflow-hidden hover:bg-zinc-50 transition"
                >
                  <div className="h-24 bg-zinc-100">
                    {c.img ? (
                      <img
                        src={imgUrl}
                        alt={c.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-500">
                        image
                      </div>
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
              );
            })}

            {top5.length === 0 && (
              <div className="text-sm text-zinc-500">
                Kategoriler yükleniyor / bulunamadı.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container mx-auto px-6 mt-8 mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-sm font-semibold">Featured Products</div>
            <div className="text-sm text-zinc-600">Öne çıkan ürünler</div>
          </div>
          <Link to="/shop" className="text-sm underline">
            View all
          </Link>
        </div>

        {productFetchState === "FETCHING" || productFetchState === "NOT_FETCHED" ? (
          <div className="text-sm text-zinc-500">Ürünler yükleniyor...</div>
        ) : !featured.length ? (
          <div className="text-sm text-zinc-500">Ürün bulunamadı.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
