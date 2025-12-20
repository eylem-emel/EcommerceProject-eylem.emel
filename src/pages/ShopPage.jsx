import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

export default function ShopPage() {
  const products = useSelector((state) => state.product.productList);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
