import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  increaseCount,
  decreaseCount,
  removeFromCart,
  toggleChecked,
} from "../store/shoppingCart.actions";

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.shoppingCart?.cart || []);

  const selectedItems = useMemo(
    () => cart.filter((i) => i?.checked !== false),
    [cart]
  );

  const total = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => acc + (item?.count || 0) * (item?.product?.price || 0),
      0
    );
  }, [selectedItems]);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Sepet</h1>
        <div className="text-gray-600">Sepetiniz boş.</div>
        <Link to="/shop" className="inline-block mt-4 text-orange-600 underline">
          Alışverişe devam et
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Sepet</h1>
        <Link to="/shop" className="text-orange-600 hover:underline">
          Alışverişe devam →
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sol: tablo */}
        <div className="lg:col-span-2 bg-white border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b bg-gray-50 text-sm font-semibold">
            <div className="col-span-1">Seç</div>
            <div className="col-span-5">Ürün</div>
            <div className="col-span-2 text-right">Fiyat</div>
            <div className="col-span-2 text-center">Adet</div>
            <div className="col-span-2 text-right">Tutar</div>
          </div>

          <div className="divide-y">
            {cart.map((item) => {
              const p = item.product;
              const rowTotal = (item.count || 0) * (p?.price || 0);
              const imgUrl =
                p?.images?.[0]?.url ||
                "https://via.placeholder.com/80?text=No+Image";

              return (
                <div key={p.id} className="grid grid-cols-12 gap-2 px-4 py-4 items-center">
                  {/* 체크 */}
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={item.checked !== false}
                      onChange={() => dispatch(toggleChecked(p.id))}
                      className="w-4 h-4"
                    />
                  </div>

                  {/* ürün */}
                  <div className="col-span-5 flex items-center gap-3">
                    <img
                      src={imgUrl}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl border object-cover"
                    />
                    <div>
                      <div className="font-medium line-clamp-1">{p.name}</div>
                      <button
                        className="text-xs text-red-600 hover:underline mt-1"
                        onClick={() => dispatch(removeFromCart(p.id))}
                      >
                        Ürünü kaldır
                      </button>
                    </div>
                  </div>

                  {/* fiyat */}
                  <div className="col-span-2 text-right text-sm">
                    {Number(p.price).toFixed(2)} ₺
                  </div>

                  {/* adet */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="w-8 h-8 rounded-lg border hover:bg-gray-50"
                        onClick={() => dispatch(decreaseCount(p.id))}
                      >
                        -
                      </button>
                      <div className="w-8 text-center font-semibold">
                        {item.count}
                      </div>
                      <button
                        className="w-8 h-8 rounded-lg border hover:bg-gray-50"
                        onClick={() => dispatch(increaseCount(p.id))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* tutar */}
                  <div className="col-span-2 text-right font-semibold">
                    {rowTotal.toFixed(2)} ₺
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ: özet kutusu (T19 benzeri) */}
        <div className="bg-white border rounded-2xl p-5 h-fit">
          <div className="text-lg font-semibold mb-4">Order Summary</div>

          <div className="flex items-center justify-between text-sm py-2">
            <div className="text-gray-600">Ürünler Toplamı</div>
            <div className="font-medium">{total.toFixed(2)} ₺</div>
          </div>

          <div className="flex items-center justify-between text-sm py-2">
            <div className="text-gray-600">Kargo</div>
            <div className="font-medium">0.00 ₺</div>
          </div>

          <div className="flex items-center justify-between text-sm py-2 border-b">
            <div className="text-gray-600">İndirim</div>
            <div className="font-medium">0.00 ₺</div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="font-semibold">Genel Toplam</div>
            <div className="font-bold">{total.toFixed(2)} ₺</div>
          </div>

          <Link
            to="/create-order"
            className="block text-center mt-4 px-4 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
          >
            Create Order
          </Link>

          <div className="text-xs text-gray-500 mt-3">
            Not: İndirim/kargo ve gerçek ödeme adımı sonraki tasklarda.
          </div>
        </div>
      </div>
    </div>
  );
}
