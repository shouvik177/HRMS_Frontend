import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const DEFAULT_AUTH = {
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  authNotRequired: true,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  // During Vite HMR the provider can be briefly missing; return safe default instead of throwing
  return ctx ?? DEFAULT_AUTH;
}
