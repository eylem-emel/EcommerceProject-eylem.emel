import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/client.actions";

export default function HomePage() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.client.theme);

  const products = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    price: `${(19.99 + i).toFixed(2)} $`,
  }));

  return (
    <div className="w-full flex flex-col gap-8 py-6">
      {/* 🔹 Redux mini test */}
      <div className="flex items-center gap-3">
        <span className="text-sm">
          Redux theme: <b>{theme}</b>
        </span>

        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => dispatch(setTheme(theme === "light" ? "dark" : "light"))}
        >
          Toggle theme
        </button>
      </div>

      {/* 🔹 Hero */}
      <HeroSlider />

      {/* 🔹 Featured products */}
      <section className="w-full flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">Featured Products</h2>
            <p className="text-sm text-zinc-600">Handpicked for you</p>
          </div>

          <button className="text-sm px-3 py-2 rounded-xl border border-zinc-200">
            View all
          </button>
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
      </section>
    </div>
  );
}
