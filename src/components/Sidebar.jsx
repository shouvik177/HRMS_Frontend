import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Employees", path: "/employees" },
  { label: "Attendance", path: "/attendance" },
];

function Sidebar() {
  return (
    <aside className="w-64 border-r border-border-dark bg-secondary-bg px-4 py-6">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          HRMS Lite
        </h1>
        <p className="mt-1 text-xs text-text-secondary">
          Human Resource Dashboard
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-accent-grey text-text-primary shadow-card"
                  : "text-text-secondary hover:bg-card-bg hover:text-text-primary"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
