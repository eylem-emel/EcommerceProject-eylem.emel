import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { useHistory } from "../routerCompat";

import api from "../api/axios";
import { fetchRolesIfNeeded } from "../store/client.thunks";

// ✅ T08 validasyonları (task'a yakın)
const emailRegex = /^\S+@\S+\.\S+$/i;
// En az 8, 1 küçük, 1 büyük, 1 sayı, 1 özel
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
// Türkiye telefon (basit): +90 opsiyonel, 5XXXXXXXXX (10 hane)
const trPhoneRegex = /^(?:\+?90)?\s?5\d{9}$/;
// TXXXXVXXXXXX  (T + 4 rakam + V + 6 rakam)
const taxNoRegex = /^T\d{4}V\d{6}$/;
// TR IBAN (boşluksuz) TR + 24 rakam
const ibanRegex = /^TR\d{24}$/;

export default function SignupPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const roles = useSelector((s) => s.client.roles);
  const safeRoles = Array.isArray(roles) ? roles : [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      role_id: "",
      store_name: "",
      store_phone: "",
      store_tax_no: "",
      store_bank_account: "",
    },
  });

  const password = watch("password");
  const selectedRoleId = watch("role_id");

  useEffect(() => {
    dispatch(fetchRolesIfNeeded());
  }, [dispatch]);

  // roles geldiyse: Customer'ı default seç
  useEffect(() => {
    if (!safeRoles.length) return;
    const current = watch("role_id");
    if (current) return;

    const customer = safeRoles.find((r) => {
      const name = String(r?.name || "").toLowerCase();
      const code = String(r?.code || "").toLowerCase();
      return name.includes("customer") || code.includes("customer");
    });

    if (customer?.id) setValue("role_id", String(customer.id));
  }, [safeRoles, setValue, watch]);

  const selectedRole = useMemo(() => {
    const idNum = Number(selectedRoleId);
    return safeRoles.find((r) => Number(r?.id) === idNum);
  }, [safeRoles, selectedRoleId]);

  const isStoreRole = useMemo(() => {
    const name = String(selectedRole?.name || "").toLowerCase();
    const code = String(selectedRole?.code || "").toLowerCase();
    return name.includes("store") || code.includes("store");
  }, [selectedRole]);

  const onSubmit = async (data) => {
    try {
      const roleId = Number(data.role_id);

      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        role_id: roleId,
      };

      if (isStoreRole) {
        // boşlukları temizleyelim
        const phone = String(data.store_phone || "").replace(/\s+/g, "");
        const taxNo = String(data.store_tax_no || "").replace(/\s+/g, "");
        const iban = String(data.store_bank_account || "").replace(/\s+/g, "");

        payload.store = {
          name: data.store_name.trim(),
          phone,
          tax_no: taxNo,
          bank_account: iban,
        };
      }

      await api.post("/signup", payload);

      toast.warn("You need to click link in email to activate your account!");

      // Task: previous page. Eğer state yoksa bir önceki history.
      const from = location.state?.from?.pathname;
      if (from) history.replace(from);
      else history.goBack();
    } catch (err) {
      console.error("Signup error:", err);
      const msg =
        err?.response?.data?.message || "Signup failed. Please check your inputs.";
      toast.error(msg);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-md mx-auto bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold">Create account</h1>
        <p className="text-sm text-zinc-600 mt-1">Sign up to start shopping.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-3">
          {/* Name */}
          <label className="text-sm font-medium">
            Name
            <input
              className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
              placeholder="Name Surname"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </label>

          {/* Email */}
          <label className="text-sm font-medium">
            Email
            <input
              className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
              type="email"
              placeholder="mail@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: emailRegex, message: "Invalid email" },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </label>

          {/* Password */}
          <label className="text-sm font-medium">
            Password
            <input
              className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: passwordRegex,
                  message: "Min 8, include lower, upper, number and special char",
                },
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </label>

          {/* Password Confirm */}
          <label className="text-sm font-medium">
            Confirm Password
            <input
              className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
              type="password"
              placeholder="••••••••"
              {...register("passwordConfirm", {
                required: "Confirm password is required",
                validate: (v) => v === password || "Passwords do not match",
              })}
            />
            {errors.passwordConfirm && (
              <p className="text-xs text-red-600 mt-1">
                {errors.passwordConfirm.message}
              </p>
            )}
          </label>

          {/* Role */}
          <label className="text-sm font-medium">
            Role
            <select
              className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
              {...register("role_id", { required: "Role is required" })}
            >
              <option value="">Select role</option>
              {safeRoles.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.role_id && (
              <p className="text-xs text-red-600 mt-1">{errors.role_id.message}</p>
            )}
          </label>

          {/* Store Fields */}
          {isStoreRole && (
            <div className="mt-2 rounded-2xl border border-zinc-200 p-4 bg-zinc-50">
              <div className="font-semibold text-sm mb-3">Store Information</div>

              <label className="text-sm font-medium block">
                Store Name
                <input
                  className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
                  placeholder="Store name"
                  {...register("store_name", {
                    required: "Store name is required",
                    minLength: { value: 3, message: "Min 3 characters" },
                  })}
                />
                {errors.store_name && (
                  <p className="text-xs text-red-600 mt-1">{errors.store_name.message}</p>
                )}
              </label>

              <label className="text-sm font-medium block mt-3">
                Store Phone (TR)
                <input
                  className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
                  placeholder="5XXXXXXXXX or +905XXXXXXXXX"
                  {...register("store_phone", {
                    required: "Phone is required",
                    validate: (v) =>
                      trPhoneRegex.test(String(v || "").replace(/\s+/g, "")) ||
                      "Invalid TR phone",
                  })}
                />
                {errors.store_phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.store_phone.message}</p>
                )}
              </label>

              <label className="text-sm font-medium block mt-3">
                Store Tax ID
                <input
                  className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
                  placeholder="T1234V123456"
                  {...register("store_tax_no", {
                    required: "Tax ID is required",
                    validate: (v) =>
                      taxNoRegex.test(String(v || "").replace(/\s+/g, "")) ||
                      "Tax ID must match TXXXXVXXXXXX",
                  })}
                />
                {errors.store_tax_no && (
                  <p className="text-xs text-red-600 mt-1">{errors.store_tax_no.message}</p>
                )}
              </label>

              <label className="text-sm font-medium block mt-3">
                Store Bank Account (IBAN)
                <input
                  className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2"
                  placeholder="TRXXXXXXXXXXXXXXXXXXXXXXXX"
                  {...register("store_bank_account", {
                    required: "IBAN is required",
                    validate: (v) =>
                      ibanRegex.test(String(v || "").replace(/\s+/g, "")) ||
                      "Invalid IBAN (TR + 24 digits)",
                  })}
                />
                {errors.store_bank_account && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.store_bank_account.message}
                  </p>
                )}
              </label>
            </div>
          )}

          <button
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-zinc-900 text-white py-2 font-semibold disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-zinc-600">
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
