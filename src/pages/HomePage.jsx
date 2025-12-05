import { ShoppingCart } from "lucide-react";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <div className="flex items-center gap-3">
        <ShoppingCart size={48} />
        <h1 className="text-3xl font-bold text-slate-800">
          EcommerceProject - eylem.emel
        </h1>
      </div>
      <p className="text-slate-600 mt-2">
        Redux + Router + Tailwind + Toastify iskeleti hazır 🎉
      </p>
    </div>
  );
}

export default HomePage;
