import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { fetchOrdersThunk } from "../store/order.thunks";

export default function PreviousOrdersPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.client?.user);

  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Protected route
  if (!user) return <Redirect to="/login" />;

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await dispatch(fetchOrdersThunk());
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        toast.error("Siparişler getirilemedi");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Siparişlerim</h1>
      </div>

      {loading && (
        <div className="p-4 border rounded-2xl bg-white text-gray-600">
          Yükleniyor...
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="p-4 border rounded-2xl bg-white text-gray-600">
          Henüz bir siparişiniz yok.
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = openId === order.id;

            const orderTotal = Number(order?.price || 0).toFixed(2);
            const orderDate = order?.order_date
              ? new Date(order.order_date).toLocaleString("tr-TR")
              : "-";

            return (
              <div key={order.id} className="border rounded-2xl bg-white overflow-hidden">
                {/* Header */}
                <button
                  type="button"
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50"
                  onClick={() => setOpenId(isOpen ? null : order.id)}
                >
                  <div>
                    <div className="font-semibold">
                      Sipariş #{order.id} • {orderTotal} ₺
                    </div>
                    <div className="text-sm text-gray-600">{orderDate}</div>
                  </div>

                  <div className="text-sm text-orange-600 font-semibold">
                    {isOpen ? "Kapat ▲" : "Detay ▼"}
                  </div>
                </button>

                {/* Collapsible content */}
                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="border-t pt-4">
                      <div className="font-semibold mb-2">Ürünler</div>

                      {!Array.isArray(order.products) || order.products.length === 0 ? (
                        <div className="text-sm text-gray-600">Ürün detayı yok.</div>
                      ) : (
                        <div className="space-y-2">
                          {order.products.map((p, idx) => (
                            <div
                              key={`${order.id}-${idx}`}
                              className="flex items-center justify-between gap-3 border rounded-xl p-3"
                            >
                              <div className="text-sm">
                                <div className="font-medium">
                                  Ürün ID: {p.product_id}
                                </div>
                                <div className="text-gray-600">
                                  Adet: {p.count} • Detay: {p.detail}
                                </div>
                              </div>
                              <div className="text-sm font-semibold">
                                {/* backend ürün fiyatı dönmüyorsa burada sadece adet gösterebiliriz */}
                                x{p.count}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 border-t pt-4 flex items-center justify-between">
                        <div className="text-gray-600">Toplam</div>
                        <div className="font-bold">{orderTotal} ₺</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
