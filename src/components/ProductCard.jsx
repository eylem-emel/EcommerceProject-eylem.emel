import { Link } from "react-router-dom";

export default function ProductCard({ id, title, price }) {
  return (
    <Link
      to={`/product/${id}`}
      className="w-full border border-zinc-200 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-300"
    >
      <div className="w-full aspect-[4/3] bg-zinc-100" />

      <div className="p-4 flex flex-col gap-2">
        <div className="text-sm font-medium text-zinc-900">{title}</div>
        <div className="text-sm text-zinc-600">{price}</div>

        <div className="mt-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm text-center">
          View details
        </div>
      </div>
    </Link>
  );
}
