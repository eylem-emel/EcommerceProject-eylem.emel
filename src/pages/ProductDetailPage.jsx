import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";

import { fetchProductByIdThunk } from "../store/product.thunks";
import { addToCart } from "../store/shoppingCart.actions";

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { productId } = useParams();

  // ✅ senin reducer yapın:
  const product = useSelector((state) => state.product?.selectedProduct);
  const fetchState = useSelector((state) => state.product?.selectedFetchState);

  useEffect(() => {
    if (productId) dispatch(fetchProductByIdThunk(Number(productId)));
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart(product));
  };

  if (fetchState === "FETCHING") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-gray-600">Ürün bulunamadı.</div>
        <Link to="/shop" className="text-orange-600 underline">
          Shop&apos;a dön
        </Link>
      </div>
    );
  }

  const imgUrl =
    product.images?.[0]?.url ||
    "https://via.placeholder.com/600x600?text=No+Image";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => history.goBack()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50"
      >
        ← Geri
      </button>

      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <div className="border rounded-2xl bg-white p-4">
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-[420px] object-cover rounded-xl"
          />
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <div className="text-2xl font-bold">{product.name}</div>

          <div className="mt-2 text-gray-600">{product.description}</div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-2xl font-semibold">
              {Number(product.price).toFixed(2)} ₺
            </div>
            <div className="text-sm text-gray-500">Stok: {product.stock}</div>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            Rating: {product.rating}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 px-5 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
            >
              Sepete Ekle
            </button>

            <Link
              to="/cart"
              className="flex-1 text-center px-5 py-3 rounded-xl border hover:bg-gray-50"
            >
              Sepete Git
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
