import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginThunk } from "../store/auth.thunks";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "", remember: false },
    mode: "onBlur",
  });

  const onSubmit = async (form) => {
    const result = await dispatch(loginThunk(form, form.remember));

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    const from = location.state?.from?.pathname;
    navigate(from || "/", { replace: true });
  };

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold">Login</h1>
        <p className="text-sm text-zinc-600">Welcome back. Please sign in.</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4"
      >
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm text-zinc-600">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
            placeholder="customer@commerce.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
            })}
          />
          {errors.email?.message ? (
            <span className="text-xs text-red-600">{errors.email.message}</span>
          ) : null}
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="text-sm text-zinc-600">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
            placeholder="123456"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password?.message ? (
            <span className="text-xs text-red-600">{errors.password.message}</span>
          ) : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-700 select-none">
          <input type="checkbox" className="accent-zinc-900" {...register("remember")} />
          Remember me
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className={[
            "px-5 py-3 rounded-xl text-white text-sm flex items-center justify-center",
            isSubmitting ? "bg-zinc-700" : "bg-zinc-900",
          ].join(" ")}
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
