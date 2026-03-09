import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("hrms_user"));

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-primary-bg text-text-primary">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 px-6 py-6">
          <Routes>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Navigate replace to="/dashboard" />} />
            <Route path="/signup" element={<Navigate replace to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
