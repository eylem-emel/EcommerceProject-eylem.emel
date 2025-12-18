import { NavLink, Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import md5 from "blueimp-md5";
import { clearUser } from "../store/client.actions";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.client.user);

  const menu = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Men", to: "/shop" },
    { label: "Women", to: "/shop" },
    { label: "Kids", to: "/shop" },
    { label: "Accessories", to: "/shop" },
    { label: "Sale", to: "/shop" },
    { label: "Contact", to: "/contact" },
    { label: "Team", to: "/team" },
    { label: "About", to: "/about" },
  ];

  const email = user?.email || "";
  const gravatar = email
    ? `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=mp&s=64`
    : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/");
  };

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
            {!user ? (
              <Link
                to="/login"
                className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center"
                aria-label="Login"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={gravatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-zinc-200"
                />
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                >
                  Logout
                </button>
              </div>
            )}

            <button className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto">
          {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                [
                  "text-sm whitespace-nowrap px-3 py-2 rounded-xl border",
                  isActive ? "border-zinc-300" : "border-transparent hover:border-zinc-200",
                ].join(" ")
              }
            >
              {item.label}
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
