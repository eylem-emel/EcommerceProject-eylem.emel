import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../store/product.thunks";
import { addToCart } from "../store/shoppingCart.actions";
import { toast } from "react-toastify";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const selectedFetchState = useSelector(
    (state) => state.product.selectedFetchState
  );

  useEffect(() => {
    if (productId) dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    dispatch(addToCart(selectedProduct));
    toast.success("Ürün sepete eklendi");
  };

  if (
    selectedFetchState === "FETCHING" ||
    selectedFetchState === "NOT_FETCHED"
  ) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (selectedFetchState === "FAILED") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded mb-6"
        >
          Back
        </button>
        <div className="text-red-500">Ürün yüklenemedi.</div>
      </div>
    );
  }

  if (!selectedProduct) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 border rounded mb-6"
      >
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={selectedProduct.images?.[0]?.url}
            alt={selectedProduct.name}
            className="w-full rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            {selectedProduct.name}
          </h1>
          <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

          <div className="text-2xl font-semibold mb-2">
            {selectedProduct.price} ₺
          </div>

          <div className="text-sm text-gray-500 mb-2">
            Stock: {selectedProduct.stock}
          </div>
          <div className="text-sm mb-6">
            Rating: {selectedProduct.rating} ⭐ | Sell:{" "}
            {selectedProduct.sell_count}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-5 py-3 rounded bg-black text-white hover:bg-gray-900"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
