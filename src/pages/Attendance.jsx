import { useEffect, useState } from "react";
import AttendanceTable from "../components/AttendanceTable";
import { attendanceApi, employeeApi } from "../services/api";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ date: "" });
  const [formData, setFormData] = useState({
    employee_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  const loadEmployees = async () => {
    const response = await employeeApi.getEmployees();
    setEmployees(response.data);
    if (response.data.length && !formData.employee_id) {
      setFormData((prev) => ({ ...prev, employee_id: String(response.data[0].id) }));
    }
  };

  const loadAttendance = async (dateFilter = "") => {
    const response = await attendanceApi.getAttendance(
      dateFilter ? { date: dateFilter } : {}
    );
    setAttendanceRows(response.data);
  };

  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([loadEmployees(), loadAttendance(filters.date)]);
      } catch (apiError) {
        setError(apiError.response?.data?.detail || "Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
    // Intentionally runs once on page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await attendanceApi.createAttendance({
        employee_id: Number(formData.employee_id),
        date: formData.date,
        status: formData.status,
      });
      await loadAttendance(filters.date);
    } catch (apiError) {
      setError(apiError.response?.data?.detail || "Failed to mark attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const applyDateFilter = async (event) => {
    const nextDate = event.target.value;
    setFilters({ date: nextDate });
    try {
      await loadAttendance(nextDate);
    } catch (apiError) {
      setError(
        apiError.response?.data?.detail || "Failed to apply attendance date filter."
      );
    }
  };

  return (
    <section className="space-y-4">
      {error && (
        <div className="rounded-lg border border-rose-700/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-border-dark bg-card-bg p-5 shadow-card">
        <h3 className="mb-4 text-lg font-semibold">Mark Attendance</h3>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleFormChange}
            required
            className="rounded-lg border border-border-dark bg-secondary-bg px-3 py-2 text-sm outline-none focus:border-accent-grey"
          >
            {!employees.length && <option value="">No employees available</option>}
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.employee_id} - {employee.full_name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            required
            className="rounded-lg border border-border-dark bg-secondary-bg px-3 py-2 text-sm outline-none focus:border-accent-grey"
          />

          <div className="flex rounded-lg border border-border-dark bg-secondary-bg p-1">
            {["Present", "Absent"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status }))}
                className={`flex-1 rounded-md px-3 py-2 text-sm ${
                  formData.status === status
                    ? "bg-accent-grey text-text-primary"
                    : "text-text-secondary"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting || !employees.length}
            className="rounded-lg bg-accent-grey px-4 py-2 text-sm font-medium transition hover:bg-border-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Mark Attendance"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border-dark bg-card-bg p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Attendance History</h3>
          <input
            type="date"
            value={filters.date}
            onChange={applyDateFilter}
            className="rounded-lg border border-border-dark bg-secondary-bg px-3 py-2 text-sm outline-none focus:border-accent-grey"
          />
        </div>

        {loading ? (
          <div className="rounded-lg border border-border-dark bg-secondary-bg p-6 text-center text-text-secondary">
            Loading attendance...
          </div>
        ) : (
          <AttendanceTable rows={attendanceRows} />
        )}
      </div>
    </section>
  );
}

export default Attendance;
