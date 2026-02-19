import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { registerApi } from "../services/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    setSuccess("");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_REGEX.test(form.email)) next.email = "Enter a valid email.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSuccess("");
    try {
      const data = await registerApi({ name: form.name, email: form.email, password: form.password });
      login(data.token);
      navigate("/", { replace: true });
    } catch (err) {
      if (err.message === "Backend not configured.") {
        login();
        navigate("/", { replace: true });
        return;
      }
      setErrors({ submit: err.message || "Signup failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-title">Sign up</h1>
        <p className="auth-subtitle">Create your HRMS account</p>
        {errors.submit && <div className="error-msg">{errors.submit}</div>}
        {success && <div className="success-msg">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              type="text"
              className={`input ${errors.name ? "error" : ""}`}
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.name && <span className="input-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              className={`input ${errors.email ? "error" : ""}`}
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <span className="input-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className={`input ${errors.password ? "error" : ""}`}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && <span className="input-error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              className={`input ${errors.confirmPassword ? "error" : ""}`}
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.confirmPassword && <span className="input-error">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;