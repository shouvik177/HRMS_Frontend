import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard Overview",
  "/employees": "Employee Management",
  "/attendance": "Attendance Management",
};

function Header({ user, onLogout }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "HRMS Lite";

  return (
    <header className="flex items-center justify-between border-b border-border-dark bg-secondary-bg px-6 py-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <p className="text-sm text-text-secondary">
          Manage your team operations with confidence.
        </p>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">{user.full_name}</span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-border-dark bg-card-bg px-3 py-1.5 text-xs font-medium text-text-primary transition hover:bg-accent-grey"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
