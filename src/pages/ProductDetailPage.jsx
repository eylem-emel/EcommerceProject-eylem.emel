// src/pages/ProductDetailPage.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHistory } from "../routerCompat";

import { fetchProductById } from "../store/product.thunks";

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { productId } = useParams();

  const product = useSelector((state) => state.product.product);
  const fetchState = useSelector((state) => state.product.fetchState);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  if (fetchState === "FETCHING") {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">Yükleniyor...</span>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => history.goBack()}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Geri
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="w-full rounded"
        />

        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="text-xl font-bold mb-4">
            {product.price} TL
          </div>

          <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
