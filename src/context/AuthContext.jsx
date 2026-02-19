import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../services/api";

const AUTH_KEY = "hrms_auth";
const TOKEN_KEY = "hrms_token";

// Assignment: "Assume a single admin user (no authentication required)"
// Set VITE_REQUIRE_AUTH=true in .env to require login; otherwise app opens straight to Dashboard.
const AUTH_NOT_REQUIRED = import.meta.env.VITE_REQUIRE_AUTH !== "true";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(AUTH_NOT_REQUIRED);

  useEffect(() => {
    if (AUTH_NOT_REQUIRED) {
      setLoggedIn(true);
      return;
    }
    const hasToken = !!localStorage.getItem(TOKEN_KEY);
    const hasLegacyAuth = localStorage.getItem(AUTH_KEY) === "true";
    setLoggedIn(hasToken || hasLegacyAuth);
  }, []);

  const login = (token) => {
    if (AUTH_NOT_REQUIRED) {
      setLoggedIn(true);
      return;
    }
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.setItem(AUTH_KEY, "true");
    setLoggedIn(true);
  };

  const logout = useCallback(() => {
    Promise.resolve(logoutApi()).finally(() => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_KEY);
      setLoggedIn(false);
      navigate("/login");
    });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, authNotRequired: AUTH_NOT_REQUIRED }}>
      {children}
    </AuthContext.Provider>
  );
}

