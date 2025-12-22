// src/pages/CreateOrderPage.jsx

import { useSelector } from "react-redux";

export default function CreateOrderPage() {
  const user = useSelector((state) => state.client.user);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {user ? (
        <div className="text-gray-700">Sipariş oluşturma adımları burada olacak.</div>
      ) : (
        <div className="text-red-600">Lütfen giriş yapın.</div>
      )}
    </div>
  );
}
