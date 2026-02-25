import { useState, useEffect } from "react";
import { getEmployees, deleteEmployee } from "../services/api";
import EmployeeEditForm from "./EmployeeEditForm";

function EmployeeList({ refreshKey = 0 }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getEmployees();
      setEmployees(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee? This will also remove their attendance records.")) return;
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      if (editingEmployee?.id === id) setEditingEmployee(null);
    } catch (err) {
      setError(err.message || "Failed to delete.");
    }
  };

  const handleEditSaved = () => {
    setEditingEmployee(null);
    load();
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading employees…</div>
      </div>
    );
  }

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

  if (employees.length === 0) {
    return (
      <div className="card">
        <div className="empty">No employees yet. Add one using the form above.</div>
      </div>
    );
  }

  return (
    <>
      {editingEmployee && (
        <EmployeeEditForm
          employee={editingEmployee}
          onSaved={handleEditSaved}
          onCancel={() => setEditingEmployee(null)}
        />
      )}
      <div className="card">
        <h3 className="page-title" style={{ marginTop: 0 }}>All Employees</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td className="cell-actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setEditingEmployee(emp)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default EmployeeList;
