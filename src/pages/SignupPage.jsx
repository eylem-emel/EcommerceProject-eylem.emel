import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import api, { setAuthToken } from "../api/axios";
import { setUser } from "../store/auth/auth.actions"; // sende auth store altındaysa
// Eğer sende user client reducer'da tutuluyorsa şunu kullan:
// import { setUser } from "../store/client.actions";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    console.log("✅ SignupPage mounted");
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // ✅ endpoint: /signup
      const res = await api.post("/signup", form);

      // backend'in response'u değişebilir:
      // örnek: { token, user } veya direkt user dönebilir
      const token = res?.data?.token;
      const user = res?.data?.user ?? res?.data;

      if (token) {
        if (rememberMe) localStorage.setItem("token", token);
        setAuthToken(token);
      }

      if (user) dispatch(setUser(user));

      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      setErr("Kayıt başarısız. Lütfen bilgileri kontrol et.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-md mx-auto bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold">Create account</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Hesap oluştur ve alışverişe başla.
        </p>

        {err && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <label className="text-sm font-medium">
            Name
            <input
              className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Ad Soyad"
              required
            />
          </label>

          <label className="text-sm font-medium">
            Email
            <input
              className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="mail@ornek.com"
              required
            />
          </label>

          <label className="text-sm font-medium">
            Password
            <input
              className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>

          <button
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-zinc-900 text-white py-2 font-semibold disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-zinc-600">
          Zaten hesabın var mı?{" "}
          <Link className="underline" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
