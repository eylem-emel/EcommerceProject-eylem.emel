// src/pages/LoginPage.jsx
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import md5 from "blueimp-md5";

import { loginThunk } from "../store/auth.thunks";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "customer@commerce.com",
      password: "123456",
      remember: true,
    },
    mode: "onBlur",
  });

  const email = watch("email");

  const gravatarUrl = useMemo(() => {
    const e = String(email || "").trim().toLowerCase();
    if (!e) return "";
    const hash = md5(e);
    return `https://www.gravatar.com/avatar/${hash}?s=96&d=identicon`;
  }, [email]);

  const fillDemo = (who) => {
    if (who === "customer") setValue("email", "customer@commerce.com");
    if (who === "store") setValue("email", "store@commerce.com");
    if (who === "admin") setValue("email", "admin@commerce.com");
    setValue("password", "123456");
  };

  const onSubmit = async (form) => {
    const payload = {
      email: form.email,
      password: form.password,
    };

    try {
      setSubmitting(true);

      // thunk -> { token, user } döndürür (aşağıdaki auth.thunks.js)
      const result = await dispatch(loginThunk({ email: form.email, password: form.password, remember: !!form.remember }));

      // redux-thunk return değerini almak için:
      const data = result;

      if (!data?.user?.email) {
        throw new Error("Login response did not include user info.");
      }

      toast.success("Login successful!");

      // Önceki sayfa: location.state?.from (Protected route ya da icon tıklamasıyla gönderilir)
      const from = location.state?.from;
      if (from) navigate(from, { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div className="w-full max-w-xl">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-xl sm:text-2xl font-semibold">Login</h1>
          <p className="text-sm text-zinc-600">Sign in to continue shopping.</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          {/* Demo buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => fillDemo("customer")}
              className="px-3 py-2 rounded-xl border border-zinc-200 text-sm hover:bg-zinc-50"
            >
              Demo: Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemo("store")}
              className="px-3 py-2 rounded-xl border border-zinc-200 text-sm hover:bg-zinc-50"
            >
              Demo: Store
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="px-3 py-2 rounded-xl border border-zinc-200 text-sm hover:bg-zinc-50"
            >
              Demo: Admin
            </button>
          </div>

          {/* Gravatar preview */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3 mb-4">
            {gravatarUrl ? (
              <img
                src={gravatarUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-100" />
            )}
            <div className="flex flex-col">
              <div className="text-sm font-semibold">Gravatar preview</div>
              <div className="text-xs text-zinc-600">
                Uses MD5(email) → gravatar image
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-600">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
                placeholder="you@email.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email?.message ? (
                <div className="text-xs text-red-600">{errors.email.message}</div>
              ) : null}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-600">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
                placeholder="123456"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password?.message ? (
                <div className="text-xs text-red-600">{errors.password.message}</div>
              ) : null}
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input type="checkbox" {...register("remember")} />
              Remember me (save token to localStorage)
            </label>

            <button
              type="submit"
              disabled={submitting}
              className={[
                "w-full px-5 py-3 rounded-xl text-white text-sm flex items-center justify-center",
                submitting ? "bg-zinc-700" : "bg-zinc-900 hover:bg-zinc-800",
              ].join(" ")}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-sm text-zinc-600">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline text-zinc-900">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
