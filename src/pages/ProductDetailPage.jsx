// src/pages/ProductDetailPage.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useHistory } from "../routerCompat";

import { fetchProductById } from "../store/product.thunks";
import { addToCart } from "../store/shoppingCart.actions";

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { productId } = useParams();

  const product = useSelector((state) => state.product.selectedProduct);
  const fetchState = useSelector((state) => state.product.selectedFetchState);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  if (fetchState === "FETCHING" || fetchState === "NOT_FETCHED") {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">Yükleniyor...</span>
      </div>
    );
  }

  if (fetchState === "FAILED") {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <span className="text-red-500">Ürün yüklenemedi.</span>
        <button
          onClick={() => dispatch(fetchProductById(productId))}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          Tekrar dene
        </button>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success("Ürün sepete eklendi");
  };

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
          src={product.images?.[0]?.url || "https://via.placeholder.com/600x600"}
          alt={product.name}
          className="w-full rounded"
        />

        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="text-xl font-bold mb-4">
            {product.price} TL
          </div>

          <button
            onClick={handleAddToCart}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
