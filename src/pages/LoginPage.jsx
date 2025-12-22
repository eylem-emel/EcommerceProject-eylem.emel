import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { useHistory } from "../routerCompat";

import { loginThunk } from "../store/client.thunks";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    try {
      await dispatch(
        loginThunk(
          { email: data.email, password: data.password },
          data.remember
        )
      );

      toast.success("Login successful");

      history.replace(from);
    } catch (err) {
      toast.error("Login failed. Email or password is incorrect.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow p-6 rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            {...register("password", { required: true })}
          />
        </div>

        {/* Remember */}
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("remember")} />
          <span className="text-sm">Remember me</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
