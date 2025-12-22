// src/pages/PreviousOrdersPage.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { fetchOrders } from "../store/order.thunks";

export default function PreviousOrdersPage() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.client.user);
  const orders = useSelector((state) => state.order.orders);
  const fetchState = useSelector((state) => state.order.fetchState);

  // Login değilse → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (fetchState === "FETCHING") {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Önceki Siparişlerim</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">Henüz bir siparişiniz yok.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Sipariş No: {order.id}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.order_date).toLocaleDateString("tr-TR")}
                </span>
              </div>

              <div className="text-sm text-gray-700">
                Toplam Tutar: <b>{order.price} TL</b>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
