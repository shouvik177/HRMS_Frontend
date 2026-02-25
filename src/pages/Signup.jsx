import { useState, useEffect } from "react";
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
  const [slowHint, setSlowHint] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      setSlowHint(false);
      return;
    }
    const t = setTimeout(() => setSlowHint(true), 5000);
    return () => clearTimeout(t);
  }, [loading]);

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
      setErrors({ submit: err.message || "Signup failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <h2 className="auth-brand-logo">HRMS</h2>
        <p className="auth-brand-tagline">
          Human Resources Management System for your organization. Create an account to manage employees and attendance.
        </p>
        <div className="auth-brand-accent" aria-hidden />
      </div>
      <div className="auth-form-panel">
        <div className="auth-card card">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Sign up to get started with HRMS</p>
          {errors.submit && <div className="error-msg">{errors.submit}</div>}
          {success && <div className="success-msg">{success}</div>}
          {slowHint && (
            <p className="auth-slow-hint">Server may be waking up. Please wait—this can take up to a minute.</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                className={`input ${errors.name ? "error" : ""}`}
                placeholder="e.g. Jane Smith"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
              />
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="signup-email">Work email</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className={`input ${errors.email ? "error" : ""}`}
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                className={`input ${errors.password ? "error" : ""}`}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="signup-confirm">Confirm password</label>
              <input
                id="signup-confirm"
                name="confirmPassword"
                type="password"
                className={`input ${errors.confirmPassword ? "error" : ""}`}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
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
    </div>
  );
}

export default Signup;