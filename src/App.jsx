import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function AppNav() {
  const { isLoggedIn, logout, authNotRequired } = useAuth();

  // Single admin, no auth required: after logout show Log in / Sign up; when logged in show main app nav
  if (authNotRequired) {
    if (!isLoggedIn) {
      return (
        <nav className="app-nav">
          <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
            Log in
          </NavLink>
          <NavLink to="/signup" className={({ isActive }) => (isActive ? "active" : "")}>
            Sign up
          </NavLink>
        </nav>
      );
    }
    return (
      <nav className="app-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/employees" className={({ isActive }) => (isActive ? "active" : "")}>
          Employees
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => (isActive ? "active" : "")}>
          Attendance
        </NavLink>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Log out
        </button>
      </nav>
    );
  }

  if (!isLoggedIn) {
    return (
      <nav className="app-nav">
        <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
          Log in
        </NavLink>
        <NavLink to="/signup" className={({ isActive }) => (isActive ? "active" : "")}>
          Sign up
        </NavLink>
      </nav>
    );
  }

  return (
    <nav className="app-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
        Dashboard
      </NavLink>
      <NavLink to="/employees" className={({ isActive }) => (isActive ? "active" : "")}>
        Employees
      </NavLink>
      <NavLink to="/attendance" className={({ isActive }) => (isActive ? "active" : "")}>
        Attendance
      </NavLink>
      <button type="button" className="btn btn-ghost" onClick={logout}>
        Log out
      </button>
    </nav>
  );
}

function AppRoutes() {
  const { isLoggedIn, authNotRequired } = useAuth();

  // Single admin, no auth: include login/signup so logout can send user there
  if (authNotRequired) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <header className="app-header">
            <h1 className="app-title">HRMS</h1>
            <AppNav />
          </header>
          <main>
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
