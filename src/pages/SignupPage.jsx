import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/axios";

export default function SignupPage() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rolesError, setRolesError] = useState("");

  const {
    register,
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

  const customerRoleId = useMemo(() => {
    const customer = roles.find((r) =>
      String(r.name || r.role || r.code || "").toLowerCase().includes("customer")
    );
    return customer?.id != null ? String(customer.id) : "";
  }, [roles]);

  const isStoreRole = useMemo(() => {
    const selected = roles.find((r) => String(r.id) === String(roleId));
    const roleName = selected?.name || selected?.role || selected?.code || "";
    return String(roleName).toLowerCase() === "store";
  }, [roles, roleId]);

  useEffect(() => {
    let alive = true;

    async function fetchRoles() {
      try {
        setLoadingRoles(true);
        setRolesError("");

        const res = await api.get("/roles");
        if (!alive) return;

        console.log("ROLES RESPONSE:", res.data);

        const list =
          (Array.isArray(res.data) && res.data) ||
          (Array.isArray(res.data?.data) && res.data.data) ||
          (Array.isArray(res.data?.roles) && res.data.roles) ||
          (Array.isArray(res.data?.data?.roles) && res.data.data.roles) ||
          [];

        console.log("ROLES LIST:", list);

        setRoles(list);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Roles alınamadı.";
        setRolesError(msg);
        toast.error("Roles alınamadı. Lütfen tekrar deneyin.");
      } finally {
        if (alive) setLoadingRoles(false);
      }
    }

    fetchRoles();

    return () => {
      alive = false;
    };
  }, []);

  // Customer default role -> kesin seçilsin (validate da et)
  useEffect(() => {
    if (!loadingRoles && roles.length && !roleId && customerRoleId) {
      setValue("role_id", customerRoleId, { shouldValidate: true });
    }
  }, [loadingRoles, roles, roleId, customerRoleId, setValue]);

  // Store değilse store alanlarını temizle
  useEffect(() => {
    if (!isStoreRole) {
      resetField("store_name");
      resetField("store_phone");
      resetField("store_tax_no");
      resetField("store_bank_account");
    }
  }, [isStoreRole, resetField]);

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
      navigate(-1);
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
        <p className="text-sm text-zinc-600">
          Create your account to start shopping.
        </p>

        {/* Debug (istersen sonra silebilirsin) */}
        {rolesError ? (
          <div className="text-sm text-red-600">Roles error: {rolesError}</div>
        ) : null}
        <div className="text-xs text-zinc-500">Roles loaded: {roles.length}</div>
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
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email",
                },
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

          <Field
            label="Confirm Password"
            error={errors.passwordConfirm?.message}
          >
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
          <select
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none bg-white"
            disabled={loadingRoles}
            {...register("role_id", { required: "Role is required" })}
            onChange={(e) =>
              setValue("role_id", e.target.value, { shouldValidate: true })
            }
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
                    pattern: {
                      value: taxNoRegex,
                      message: "Format: TXXXXVXXXXXX",
                    },
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
  if (s.startsWith("0")) return "+9" + s; // 0XXXXXXXXXX => +90XXXXXXXXXX
  if (/^5\d{9}$/.test(s)) return "+90" + s; // 5XXXXXXXXX => +905XXXXXXXXX
  return s;
}

function normalizeIBAN(v) {
  return String(v || "").replace(/\s+/g, "").toUpperCase();
}

function isValidTRIban(v) {
  const iban = normalizeIBAN(v);
  return /^TR\d{24}$/.test(iban);
}
