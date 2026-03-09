import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await authApi.login(formData);
      localStorage.setItem("hrms_user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (apiError) {
      if (apiError.code === "ECONNABORTED") {
        setError("Server is waking up. Please wait a few seconds and try again.");
      } else if (!apiError.response) {
        setError("Cannot reach server. Check backend URL/environment variable.");
      } else {
        setError(apiError.response?.data?.detail || "Login failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-primary-bg p-4">
      <div className="w-full max-w-md rounded-2xl border border-border-dark bg-card-bg p-6 shadow-card">
        <h1 className="text-2xl font-semibold text-text-primary">Login to Human Resource Management </h1>
        <p className="mt-1 text-sm text-text-secondary">Access your dashboard securely.</p>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-700/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-text-secondary">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border-dark bg-secondary-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-grey"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-text-secondary">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border-dark bg-secondary-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-grey"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent-grey px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-border-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link className="text-text-primary underline" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
