import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const genderRaw = (product.gender ?? "").toString().toLowerCase();
  const gender =
    genderRaw === "k" || genderRaw.includes("kadin") || genderRaw.includes("women")
      ? "kadin"
      : genderRaw === "e" || genderRaw.includes("erkek") || genderRaw.includes("men")
      ? "erkek"
      : "kadin";

  const categoryId = product.category_id ?? product.categoryId ?? 0;

  // categoryName ürün objesinde yoksa URL için en azından "kategori" kullanırız.
  const categoryName =
    product.categoryName ?? product.category_name ?? product.category ?? "kategori";

  const productNameSlug = slugify(product.name);

  const handleClick = () => {
    navigate(
      `/shop/${gender}/${slugify(categoryName)}/${categoryId}/${productNameSlug}/${product.id}`
    );
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="cursor-pointer border rounded-lg p-3 hover:shadow-lg hover:-translate-y-0.5 transition"
      title="Detaya git"
    >
      <img
        src={product.images?.[0]?.url}
        alt={product.name}
        className="w-full h-60 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold text-sm line-clamp-2">{product.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{product.price} ₺</p>
    </div>
  );
}
