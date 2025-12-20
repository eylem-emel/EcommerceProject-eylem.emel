import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../store/product.thunks";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, selectedFetchState } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  if (selectedFetchState === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!selectedProduct) return null;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img
          src={selectedProduct.images?.[0]?.url}
          alt={selectedProduct.name}
          className="w-full rounded-lg"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4">
          {selectedProduct.name}
        </h1>

        <p className="text-gray-600 mb-4">
          {selectedProduct.description}
        </p>

        <p className="text-2xl font-semibold mb-2">
          {selectedProduct.price} ₺
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Stock: {selectedProduct.stock}
        </p>

        <p className="text-sm mb-6">
          Rating: {selectedProduct.rating} ⭐
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>

          <button
            onClick={() => navigate("/shop")}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Back to Shop
          </button>
        </div>
      </div>
    </div>
  );
}
