import { useState, useEffect } from "react";
import { getEmployees, getAttendance } from "../services/api";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getEmployees(), getAttendance()])
      .then(([empList, attList]) => {
        if (cancelled) return;
        setEmployees(Array.isArray(empList) ? empList : []);
        setAttendance(Array.isArray(attList) ? attList : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const today = new Date().toISOString().slice(0, 10);
  const presentToday = attendance.filter((a) => a.date === today && a.status === "Present").length;


  const presentByEmployee = employees.map((emp) => {
    const count = attendance.filter(
      (a) => a.employee_id === emp.employee_id && a.status === "Present"
    ).length;
    return { ...emp, presentDays: count };
  }).sort((a, b) => b.presentDays - a.presentDays);

  if (loading) return <div className="card"><div className="loading">Loading dashboard…</div></div>;
  if (error) return <div className="card"><div className="error-msg">{error}</div></div>;

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="value">{employees.length}</div>
          <div className="label">Total Employees</div>
        </div>
        <div className="stat-card">
          <div className="value">{presentCount}</div>
          <div className="label">Total Present Days (all time)</div>
        </div>
        <div className="stat-card">
          <div className="value">{presentToday}</div>
          <div className="label">Present Today</div>
        </div>
      </div>
      {employees.length > 0 && (
        <div className="card">
          <h3 className="page-title" style={{ marginTop: 0 }}>Present days per employee</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Present days</th>
                </tr>
              </thead>
              <tbody>
                {presentByEmployee.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.full_name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.presentDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="card">
        <h3 className="page-title" style={{ marginTop: 0 }}>Quick summary</h3>
        <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
          Use <strong>Employees</strong> to add or remove staff. Use <strong>Attendance</strong> to mark daily Present/Absent and view or filter records.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
