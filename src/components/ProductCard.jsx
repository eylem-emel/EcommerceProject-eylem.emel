export default function ProductCard({ title, price }) {
  return (
    <div className="w-full border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
      <div className="w-full aspect-[4/3] bg-zinc-100" />
      <div className="p-4 flex flex-col gap-2">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-zinc-600">{price}</div>
        <button className="mt-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm">
          Add to cart
        </button>
      </div>
    </div>
  );
}
