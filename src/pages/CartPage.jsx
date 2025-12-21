import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  addToCart,
  decreaseCartItem,
  removeFromCart,
  toggleCartItem,
} from "../store/shoppingCart.actions";

// Ürün adı alanı farklı olabilir
const getName = (p) => p?.name || p?.title || "Ürün";

// Görsel alanı farklı olabilir: images[0] string / images[0].url / image / img
const getImg = (p) => {
  if (!p) return "";

  const first = Array.isArray(p.images) ? p.images[0] : null;
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && first.url) return first.url;

  if (p.image) return p.image;
  if (p.img) return p.img;

  return "";
};

const getPrice = (p) => Number(p?.price) || 0;

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.shoppingCart?.cart || []);

  const { selectedCount, selectedTotal, allCount } = useMemo(() => {
    const all = cart.reduce((sum, i) => sum + (i.count || 0), 0);
    const selected = cart
      .filter((i) => i.checked)
      .reduce((sum, i) => sum + (i.count || 0), 0);

    const total = cart
      .filter((i) => i.checked)
      .reduce((sum, i) => sum + getPrice(i.product) * (i.count || 0), 0);

    return { allCount: all, selectedCount: selected, selectedTotal: total };
  }, [cart]);

  if (!cart.length) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Sepetim</h1>
        <p className="mt-4 text-gray-600">Sepetin şu an boş.</p>
        <Link to="/shop" className="inline-flex mt-6 px-5 py-3 rounded-xl bg-black text-white">
          Alışverişe devam et
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Sepetim</h1>
          <p className="text-sm text-gray-600 mt-1">
            Toplam ürün adedi: {allCount} • Seçili: {selectedCount}
          </p>
        </div>

        <Link to="/shop" className="text-sm underline text-gray-700 w-fit">
          Alışverişe devam et
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border bg-white overflow-hidden">
        {/* header row */}
        <div className="hidden md:grid grid-cols-[44px_88px_1fr_140px_140px_120px_44px] gap-4 px-4 py-3 border-b bg-gray-50 text-xs font-semibold text-gray-600">
          <div></div>
          <div>Ürün</div>
          <div>Ad</div>
          <div className="text-right">Birim</div>
          <div className="text-center">Adet</div>
          <div className="text-right">Ara Toplam</div>
          <div></div>
        </div>

        <div className="divide-y">
          {cart.map((item) => {
            const p = item.product;
            const price = getPrice(p);
            const subtotal = price * (item.count || 0);

            return (
              <div
                key={p?.id}
                className="grid grid-cols-[28px_72px_1fr] md:grid-cols-[44px_88px_1fr_140px_140px_120px_44px] gap-3 md:gap-4 items-center px-4 py-4"
              >
                {/* select */}
                <input
                  type="checkbox"
                  checked={!!item.checked}
                  onChange={() => dispatch(toggleCartItem(p.id))}
                  className="w-4 h-4"
                />

                {/* image */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-100 overflow-hidden">
                  <img
                    src={getImg(p)}
                    alt={getName(p)}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/80x80.png?text=No+Img";
                    }}
                  />
                </div>

                {/* name + mobile price */}
                <div className="min-w-0">
                  <div className="font-semibold line-clamp-2">{getName(p)}</div>
                  <div className="md:hidden text-sm text-gray-600 mt-1">{price.toFixed(2)} TL</div>
                </div>

                {/* desktop unit price */}
                <div className="hidden md:block text-right font-medium">{price.toFixed(2)} TL</div>

                {/* qty */}
                <div className="col-span-3 md:col-span-1 flex items-center justify-between md:justify-center gap-3 mt-3 md:mt-0">
                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseCartItem(p.id))}
                      className="w-10 h-10 grid place-items-center text-lg"
                      aria-label="decrease"
                    >
                      −
                    </button>
                    <div className="w-12 h-10 grid place-items-center text-sm font-semibold border-x">
                      {item.count}
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch(addToCart(p))}
                      className="w-10 h-10 grid place-items-center text-lg"
                      aria-label="increase"
                    >
                      +
                    </button>
                  </div>

                  {/* mobile subtotal */}
                  <div className="md:hidden text-right font-semibold">{subtotal.toFixed(2)} TL</div>
                </div>

                {/* desktop subtotal */}
                <div className="hidden md:block text-right font-semibold">{subtotal.toFixed(2)} TL</div>

                {/* remove */}
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(p.id))}
                  className="text-gray-500 hover:text-black"
                  title="Remove"
                  aria-label="remove"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* total */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-gray-600">
          Yalnızca <span className="font-semibold">seçili</span> ürünler toplamı hesaplanır.
        </div>

        <div className="rounded-2xl border bg-white p-4 w-full md:w-[360px]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Seçili Toplam</span>
            <span className="text-lg font-bold">{selectedTotal.toFixed(2)} TL</span>
          </div>

          <button
            type="button"
            disabled={selectedCount === 0}
            className="mt-3 w-full bg-orange-500 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
          >
            Siparişi Tamamla
          </button>

          <div className="mt-2 text-xs text-gray-500">(Order Summary / Create Order sonraki tasklerde.)</div>
        </div>
      </div>
    </div>
  );
}
