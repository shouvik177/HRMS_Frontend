import { useState, useEffect } from "react";
import { getAttendance, getEmployees } from "../services/api";

function AttendanceList({ refreshKey = 0, filterDate = "", filterEmployeeId = "", onFilterDateChange, onFilterEmployeeChange }) {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    const params = {};
    if (filterDate) params.date = filterDate;
    if (filterEmployeeId) params.employee_id = filterEmployeeId;
    Promise.all([getAttendance(params), getEmployees()])
      .then(([attList, empList]) => {
        setRecords(Array.isArray(attList) ? attList : []);
        setEmployees(Array.isArray(empList) ? empList : []);
      })
      .catch((err) => setError(err.message || "Failed to load attendance."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [refreshKey, filterDate, filterEmployeeId]);

  const getName = (employeeId) => {
    const emp = employees.find((e) => e.employee_id === employeeId);
    return emp ? emp.full_name : employeeId;
  };

  if (loading) return <div className="card"><div className="loading">Loading attendance…</div></div>;
  if (error) {
    return (
      <div className="card">
        <div className="error-msg">{error}</div>
        <button type="button" className="btn btn-ghost" onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  if (records.length === 0) {
    let emptyMsg = "No attendance records yet. Mark attendance using the form above.";
    if (filterDate || filterEmployeeId) emptyMsg = "No attendance records match the selected filters.";
    return (
      <div className="card">
        <div className="empty">{emptyMsg}</div>
      </div>
    );
  }

  const sorted = [...records].sort((a, b) => {
    const d = b.date.localeCompare(a.date);
    return d !== 0 ? d : (a.employee_id || "").localeCompare(b.employee_id || "");
  });

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <h3 className="page-title mb-0" style={{ marginTop: 0 }}>Attendance Records</h3>
        {onFilterDateChange && (
          <>
            <label style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Filter by date</label>
            <input
              type="date"
              className="input"
              value={filterDate}
              onChange={(e) => onFilterDateChange(e.target.value)}
              style={{ width: "auto" }}
            />
          </>
        )}
        {onFilterEmployeeChange && (
          <>
            <label style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Filter by employee</label>
            <select
              className="select"
              value={filterEmployeeId}
              onChange={(e) => onFilterEmployeeChange(e.target.value)}
              style={{ width: "auto", minWidth: 180 }}
            >
              <option value="">All employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>{emp.full_name} ({emp.employee_id})</option>
              ))}
            </select>
          </>
        )}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{getName(r.employee_id)}</td>
                <td>
                <span className={r.status === "Present" ? "status-present" : "status-absent"}>
                  {r.status}
                </span>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceList;
