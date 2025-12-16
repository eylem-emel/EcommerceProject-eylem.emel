import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-200">
      <div className="w-full max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900" />
            <span className="font-semibold">Ecommerce</span>
          </Link>

          <div className="hidden sm:flex flex-1 justify-center">
            <div className="w-full max-w-md flex items-center gap-2 border border-zinc-200 rounded-xl px-3 py-2">
              <Search className="w-4 h-4" />
              <input
                className="w-full outline-none bg-transparent text-sm"
                placeholder="Search products..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center">
              <User className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto">
          {["Shop", "Men", "Women", "Kids", "Accessories", "Sale"].map((item) => (
            <NavLink
              key={item}
              to="/"
              className="text-sm whitespace-nowrap px-3 py-2 rounded-xl border border-transparent hover:border-zinc-200"
            >
              {item}
            </NavLink>
          ))}
        </nav>

        <div className="sm:hidden flex">
          <div className="w-full flex items-center gap-2 border border-zinc-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4" />
            <input
              className="w-full outline-none bg-transparent text-sm"
              placeholder="Search products..."
            />
          </div>
        </div>
      </div>
    </header>
  );
}
