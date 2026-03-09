import { useEffect, useMemo, useState } from "react";
import { attendanceApi, employeeApi } from "../services/api";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const [employeesResponse, attendanceResponse] = await Promise.all([
          employeeApi.getEmployees(),
          attendanceApi.getAttendance({ date: today }),
        ]);
        setEmployees(employeesResponse.data);
        setTodayAttendance(attendanceResponse.data);
      } catch (apiError) {
        setError(
          apiError.response?.data?.detail || "Failed to load dashboard summary."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [today]);

  const presentCount = todayAttendance.filter(
    (item) => item.status === "Present"
  ).length;
  const absentCount = todayAttendance.filter((item) => item.status === "Absent").length;

  const cards = [
    { label: "Total Employees", value: employees.length },
    { label: "Total Present Today", value: presentCount },
    { label: "Total Absent Today", value: absentCount },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-border-dark bg-card-bg p-8 text-center text-text-secondary">
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {error && (
        <div className="rounded-lg border border-rose-700/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-border-dark bg-card-bg p-5 shadow-card"
          >
            <p className="text-sm text-text-secondary">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-text-primary">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-border-dark bg-card-bg p-5 shadow-card">
        <h3 className="text-lg font-semibold">Today&apos;s Attendance Snapshot</h3>
        {!todayAttendance.length ? (
          <p className="mt-3 text-sm text-text-secondary">
            No attendance records found for today.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {todayAttendance.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border-dark bg-secondary-bg px-4 py-3"
              >
                <div>
                  <p className="text-sm">{item.employee_name}</p>
                  <p className="text-xs text-text-secondary">{item.employee_code}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === "Present"
                      ? "bg-emerald-800/60 text-emerald-200"
                      : "bg-rose-800/60 text-rose-200"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
