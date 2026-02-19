import { useState, useEffect } from "react";
import { updateEmployee } from "../services/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmployeeEditForm({ employee, onSaved, onCancel }) {
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        employee_id: employee.employee_id || "",
        full_name: employee.full_name || "",
        email: employee.email || "",
        department: employee.department || "",
      });
      setErrors({});
    }
  }, [employee]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    const next = {};
    if (!form.employee_id.trim()) next.employee_id = "Employee ID is required.";
    if (!form.full_name.trim()) next.full_name = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_REGEX.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.department.trim()) next.department = "Department is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await updateEmployee(employee.id, form);
      onSaved?.();
    } catch (err) {
      setErrors({ submit: err.message || "Update failed." });
    } finally {
      setLoading(false);
    }
  };

  if (!employee) return null;

  return (
    <div className="card">
      <h3 className="page-title" style={{ marginTop: 0 }}>Edit Employee</h3>
      {errors.submit && <div className="error-msg">{errors.submit}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              name="employee_id"
              className={`input ${errors.employee_id ? "error" : ""}`}
              placeholder="e.g. EMP001"
              value={form.employee_id}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.employee_id && <span className="input-error">{errors.employee_id}</span>}
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="full_name"
              className={`input ${errors.full_name ? "error" : ""}`}
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.full_name && <span className="input-error">{errors.full_name}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              className={`input ${errors.email ? "error" : ""}`}
              placeholder="email@company.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <span className="input-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              name="department"
              className={`input ${errors.department ? "error" : ""}`}
              placeholder="e.g. Engineering"
              value={form.department}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.department && <span className="input-error">{errors.department}</span>}
          </div>
        </div>
        <div className="form-row">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeEditForm;
