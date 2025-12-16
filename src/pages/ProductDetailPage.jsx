import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();

  const product = {
    id,
    title: `Product ${id}`,
    price: `${(19.99 + Number(id)).toFixed(2)} $`,
    desc: "Comfortable, durable, and stylish. Placeholder description for product detail page.",
  };

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="w-full flex">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-zinc-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[52%] flex">
          <div className="w-full rounded-2xl border border-zinc-200 overflow-hidden flex">
            <div className="w-full aspect-[4/3] lg:aspect-[4/4] bg-zinc-100" />
          </div>
        </div>

        <div className="w-full lg:w-[48%] flex">
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900">
                {product.title}
              </h1>
              <div className="text-lg text-zinc-900">{product.price}</div>
              <p className="text-sm text-zinc-600">{product.desc}</p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-zinc-600">Size</span>
                <div className="flex flex-wrap gap-2">
                  {["S", "M", "L", "XL"].map((s) => (
                    <button
                      key={s}
                      className="px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-zinc-600">Quantity</span>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl border border-zinc-200">
                    -
                  </button>
                  <div className="w-12 h-10 rounded-xl border border-zinc-200 flex items-center justify-center text-sm">
                    1
                  </div>
                  <button className="w-10 h-10 rounded-xl border border-zinc-200">
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 text-white text-sm">
                Add to cart
              </button>
              <button className="w-full sm:w-auto px-5 py-3 rounded-xl border border-zinc-200 text-sm">
                Add to wishlist
              </button>
            </div>

            <div className="w-full flex flex-col gap-2 pt-2">
              {[
                ["Material", "Cotton blend"],
                ["Shipping", "2-4 business days"],
                ["Returns", "14 days return policy"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="w-full flex items-center justify-between gap-4 border-b border-zinc-100 py-2"
                >
                  <span className="text-sm text-zinc-600">{k}</span>
                  <span className="text-sm text-zinc-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
