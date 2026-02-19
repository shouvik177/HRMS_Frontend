import { useState, useEffect } from "react";
import { getEmployees } from "../services/api";
import { markAttendance } from "../services/api";

function AttendanceForm({ onMarked }) {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState(null);
  const [submitErr, setSubmitErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    getEmployees()
      .then((list) => {
        if (!cancelled) setEmployees(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (!cancelled) setLoadErr(err.message || "Failed to load employees.");
      });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      setSubmitErr("Please select an employee.");
      return;
    }
    setLoading(true);
    setSubmitErr("");
    try {
      await markAttendance({ employee_id: employeeId, date, status });
      onMarked?.();
    } catch (err) {
      setSubmitErr(err.message || "Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  if (loadErr) return <div className="card"><div className="error-msg">{loadErr}</div></div>;

  return (
    <div className="card">
      <h3 className="page-title" style={{ marginTop: 0 }}>Mark Attendance</h3>
      {submitErr && <div className="error-msg">{submitErr}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Employee</label>
            <select
              className="select"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              disabled={loading || employees.length === 0}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.employee_id} – {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="form-group">
            <label>&nbsp;</label>
            <button type="submit" className="btn btn-primary" disabled={loading || employees.length === 0}>
              {loading ? "Saving…" : "Mark Attendance"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AttendanceForm;
