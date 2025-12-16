import ProductCard from "../components/ProductCard";

export default function ShopPage() {
  const products = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `Shop Product ${i + 1}`,
    price: `${(29.99 + i).toFixed(2)} $`,
  }));

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold">Shop</h1>
        <p className="text-sm text-zinc-600">Browse all products</p>
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", "New", "Popular", "Sale"].map((t) => (
            <button
              key={t}
              className="px-3 py-2 rounded-xl border border-zinc-200 text-sm"
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-600">Sort:</span>
          <select className="px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      <div className="w-full flex flex-wrap gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] flex"
          >
            <ProductCard id={p.id} title={p.title} price={p.price} />
          </div>
        ))}
      </div>
    </div>
  );
}
