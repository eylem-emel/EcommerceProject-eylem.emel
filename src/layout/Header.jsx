import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import md5 from "blueimp-md5";

import { clearUser } from "../store/client.actions";

export default function Header() {
  const user = useSelector((state) => state.client.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          E-Commerce
        </Link>

        {/* Nav */}
        <nav className="flex gap-6 items-center">
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/team">Team</Link>
          <Link to="/contact">Contact</Link>

          {/* Auth area */}
          {!user ? (
            <>
              <Link
                to="/login"
                state={{ from: location.pathname + location.search }}
                className="font-medium"
              >
                Login
              </Link>
              <Link to="/signup" className="font-medium">
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={`https://www.gravatar.com/avatar/${md5(
                  user.email.trim().toLowerCase()
                )}?s=40&d=identicon`}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
