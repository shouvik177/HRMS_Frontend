import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginApi } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login(data.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <h2 className="auth-brand-logo">HRMS</h2>
        <p className="auth-brand-tagline">
          Human Resources Management System for your organization. Sign in to manage employees and attendance.
        </p>
        <div className="auth-brand-accent" aria-hidden />
      </div>
      <div className="auth-form-panel">
        <div className="auth-card card">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your HRMS account</p>
          {error && <div className="error-msg">{error}</div>}
          {slowHint && (
            <p className="auth-slow-hint">Server may be waking up. Please wait—this can take up to a minute.</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Work email</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>
          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
