import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "../routerCompat";
import { addToCart } from "../store/shoppingCart.actions";

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const genderRaw = (product.gender ?? "").toString().toLowerCase();
  const gender =
    genderRaw === "k" ||
    genderRaw.includes("kadin") ||
    genderRaw.includes("women")
      ? "kadin"
      : genderRaw === "e" ||
        genderRaw.includes("erkek") ||
        genderRaw.includes("men")
      ? "erkek"
      : "kadin";

  const categoryId = product.category_id ?? product.categoryId ?? 0;

  // categoryName ürün objesinde yoksa URL için en azından "kategori" kullanırız.
  const categoryName =
    product.categoryName ?? product.category_name ?? product.category ?? "kategori";

  const productNameSlug = slugify(product.name);

  const handleClick = () => {
    history.push(
      `/shop/${gender}/${slugify(categoryName)}/${categoryId}/${productNameSlug}/${product.id}`
    );
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success("Ürün sepete eklendi");
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="cursor-pointer border rounded-lg p-3 hover:shadow-lg hover:-translate-y-0.5 transition bg-white"
      title="Detaya git"
    >
      <img
        src={product.images?.[0]?.url}
        alt={product.name}
        className="w-full h-60 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold text-sm line-clamp-2">{product.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{product.price} ₺</p>

      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-3 w-full bg-black text-white rounded-lg py-2 text-sm hover:bg-gray-800"
      >
        Sepete Ekle
      </button>
    </div>
  );
}
