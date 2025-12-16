import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/axios";

import { useDispatch, useSelector } from "react-redux";
import { fetchRolesIfNeeded } from "../store/roles.thunks";

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Roles artık Redux store'dan geliyor
  const roles = useSelector((state) => state.client.roles);

  // T09 için yeterli "loading" mantığı: roles boşsa loading
  const loadingRoles = !Array.isArray(roles) || roles.length === 0;

  // Bu sayfada rolesError'ı Redux'ta tutmuyoruz (task istemiyor)
  const rolesError = "";

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    resetField,
    setValue,
    formState: { errors },
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
    mode: "onBlur",
  });

  const roleId = watch("role_id");
  const password = watch("password");

  // ✅ Need-based thunk: roles gerekiyorsa çağrılır, doluysa tekrar fetch etmez
  useEffect(() => {
    dispatch(fetchRolesIfNeeded());
  }, [dispatch]);

  // Default role: customer varsa onu, yoksa ilk rol
  useEffect(() => {
    if (loadingRoles) return;
    if (!roles.length) return;
    if (roleId) return;

    const customer =
      roles.find((r) =>
        String(r.name || r.role || r.code || "")
          .toLowerCase()
          .includes("customer")
      ) ||
      roles.find((r) =>
        String(r.name || r.role || r.code || "")
          .toLowerCase()
          .includes("müşteri")
      ) ||
      null;

    const defaultId = customer?.id ?? roles[0]?.id;
    if (defaultId != null) {
      setValue("role_id", String(defaultId), { shouldValidate: true });
    }
  }, [loadingRoles, roles, roleId, setValue]);

  const selectedRoleName = useMemo(() => {
    const selected = roles.find((r) => String(r.id) === String(roleId));
    return String(selected?.name || selected?.role || selected?.code || "").toLowerCase();
  }, [roles, roleId]);

  const isStoreRole = selectedRoleName === "store";

  // Store değilse store alanlarını temizle
  useEffect(() => {
    if (!isStoreRole) {
      resetField("store_name");
      resetField("store_phone");
      resetField("store_tax_no");
      resetField("store_bank_account");
    }
  }, [isStoreRole, resetField]);

  // Validations
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const trPhoneRegex = /^(\+90|0)?5\d{9}$/;
  const taxNoRegex = /^T\d{4}V\d{6}$/;

  const onSubmit = async (form) => {
    const base = {
      name: form.name,
      email: form.email,
      password: form.password,
      role_id: Number(form.role_id),
    };

    const payload = isStoreRole
      ? {
          ...base,
          store: {
            name: form.store_name,
            phone: normalizeTRPhone(form.store_phone),
            tax_no: form.store_tax_no,
            bank_account: normalizeIBAN(form.store_bank_account),
          },
        }
      : base;

    try {
      setSubmitting(true);
      await api.post("/signup", payload);

      toast.warn("You need to click link in email to activate your account!");

      // önceki sayfa bizim sitemizse geri dön, değilse home'a
      const ref = document.referrer;
      const sameSite = ref && ref.startsWith(window.location.origin);

      if (sameSite) navigate(-1);
      else navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Sign up başarısız. Lütfen bilgileri kontrol edip tekrar deneyin.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold">Sign Up</h1>
        <p className="text-sm text-zinc-600">Create your account to start shopping.</p>

        {rolesError ? (
          <div className="text-sm text-red-600">Roles error: {rolesError}</div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4"
      >
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Field label="Name" error={errors.name?.message}>
            <input
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
              placeholder="Your name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
          </Field>

          <Field label="Email" error={errors.email?.message}>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
              placeholder="you@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
            />
          </Field>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Field label="Password" error={errors.password?.message}>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
              placeholder="********"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: passwordRegex,
                  message: "Min 8 chars, include lower/upper/number/special",
                },
              })}
            />
          </Field>

          <Field label="Confirm Password" error={errors.passwordConfirm?.message}>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
              placeholder="********"
              {...register("passwordConfirm", {
                required: "Please confirm your password",
                validate: (v) => v === password || "Passwords do not match",
              })}
            />
          </Field>
        </div>

        <Field label="Role" error={errors.role_id?.message}>
          <Controller
            name="role_id"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none bg-white"
                disabled={loadingRoles}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <option value="" disabled>
                  {loadingRoles ? "Loading roles..." : "Select role"}
                </option>

                {roles.map((r) => (
                  <option key={r.id} value={String(r.id)}>
                    {r.name || r.role || r.code || `Role ${r.id}`}
                  </option>
                ))}
              </select>
            )}
          />
        </Field>

        {isStoreRole && (
          <div className="w-full flex flex-col gap-4 pt-2">
            <div className="text-sm font-semibold">Store Details</div>

            <Field label="Store Name" error={errors.store_name?.message}>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
                placeholder="Store name"
                {...register("store_name", {
                  required: "Store name is required",
                  minLength: { value: 3, message: "Min 3 characters" },
                })}
              />
            </Field>

            <div className="w-full flex flex-col sm:flex-row gap-4">
              <Field label="Store Phone" error={errors.store_phone?.message}>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
                  placeholder="05XXXXXXXXX or +905XXXXXXXXX"
                  {...register("store_phone", {
                    required: "Phone is required",
                    pattern: {
                      value: trPhoneRegex,
                      message: "Invalid TR phone (e.g. 05XXXXXXXXX)",
                    },
                  })}
                />
              </Field>

              <Field label="Store Tax ID" error={errors.store_tax_no?.message}>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
                  placeholder="TXXXXVXXXXXX"
                  {...register("store_tax_no", {
                    required: "Tax ID is required",
                    pattern: { value: taxNoRegex, message: "Format: TXXXXVXXXXXX" },
                  })}
                />
              </Field>
            </div>

            <Field
              label="Store Bank Account (IBAN)"
              error={errors.store_bank_account?.message}
            >
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
                placeholder="TR________________________"
                {...register("store_bank_account", {
                  required: "IBAN is required",
                  validate: (v) => isValidTRIban(v) || "Invalid TR IBAN",
                })}
              />
            </Field>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={[
            "px-5 py-3 rounded-xl text-white text-sm flex items-center justify-center",
            submitting ? "bg-zinc-700" : "bg-zinc-900",
          ].join(" ")}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Submitting...
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm text-zinc-600">{label}</label>
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </div>
      {children}
    </div>
  );
}

function normalizeTRPhone(v) {
  const s = String(v || "").replace(/\s+/g, "");
  if (s.startsWith("+90")) return s;
  if (s.startsWith("0")) return "+9" + s;
  if (/^5\d{9}$/.test(s)) return "+90" + s;
  return s;
}

function normalizeIBAN(v) {
  return String(v || "").replace(/\s+/g, "").toUpperCase();
}

function isValidTRIban(v) {
  const iban = normalizeIBAN(v);
  return /^TR\d{24}$/.test(iban);
}
