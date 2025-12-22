import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { fetchOrdersThunk } from "../store/order.thunks";

const asArray = (x) => (Array.isArray(x) ? x : []);

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleString("tr-TR");
};

export default function PreviousOrdersPage() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await dispatch(fetchOrdersThunk());
        const list = asArray(data) || asArray(data?.orders);
        setOrders(list);
      } catch (e) {
        toast.error("Siparişler alınamadı");
      }
    })();
  }, [dispatch]);

  const totalCount = useMemo(() => orders.length, [orders]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Geçmiş Siparişlerim</h1>
          <p className="text-sm text-gray-600 mt-1">Toplam sipariş: {totalCount}</p>
        </div>
        <Link to="/shop" className="text-sm underline text-gray-700 w-fit">
          Alışverişe devam et
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {orders.map((o) => {
          const id = o.id || o.order_id || o.orderId;
          const isOpen = openId === id;
          const products = asArray(o.products) || asArray(o.items);

          return (
            <div key={id} className="rounded-2xl border bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : id)}
                className="w-full text-left p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  <div className="font-semibold">Sipariş #{id}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatDate(o.order_date || o.created_at || o.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">Ürün: {products.length}</div>
                  <div className="font-semibold text-orange-500">
                    {Number(o.price || o.total || 0).toFixed(2)} TL
                  </div>
                  <span className="text-xs text-gray-500">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border p-3">
                      <div className="text-sm font-semibold">Adres</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Adres ID: {o.address_id || o.addressId || "—"}
                      </div>
                    </div>

                    <div className="rounded-xl border p-3">
                      <div className="text-sm font-semibold">Ödeme</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Kart: **** {String(o.card_no || "").slice(-4) || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border overflow-hidden">
                    <div className="grid grid-cols-[1fr_80px_140px] gap-3 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600">
                      <div>Ürün</div>
                      <div className="text-center">Adet</div>
                      <div>Detay</div>
                    </div>
                    <div className="divide-y">
                      {products.map((p, idx) => (
                        <div
                          key={p.product_id || p.id || idx}
                          className="grid grid-cols-[1fr_80px_140px] gap-3 px-4 py-3 text-sm"
                        >
                          <div className="text-gray-800">Ürün #{p.product_id || p.id}</div>
                          <div className="text-center">{p.count || 1}</div>
                          <div className="text-gray-600">{p.detail || "—"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="rounded-2xl border bg-white p-6 text-gray-600">
            Henüz siparişin yok.
          </div>
        )}
      </div>
    </div>
  );
}
