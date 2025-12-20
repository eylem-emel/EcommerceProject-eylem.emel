import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleClick = () => {
    navigate(
      `/shop/${product.gender}/${product.categoryName}/${product.category_id}/${slugify(
        product.name
      )}/${product.id}`
    );
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer border rounded-lg p-3 hover:shadow-lg transition"
    >
      <img
        src={product.images?.[0]?.url}
        alt={product.name}
        className="w-full h-64 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.price} ₺</p>
    </div>
  );
}
