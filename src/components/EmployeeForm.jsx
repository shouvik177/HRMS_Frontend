import { useState } from "react";
import { addEmployee } from "../services/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmployeeForm({ onAdded }) {
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    setSuccess("");
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
    setSuccess("");
    try {
      await addEmployee(form);
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      setSuccess("Employee added successfully.");
      onAdded?.();
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="page-title" style={{ marginTop: 0 }}>Add Employee</h3>
      {errors.submit && <div className="error-msg">{errors.submit}</div>}
      {success && <div className="success-msg">{success}</div>}
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
            {errors.employee_id && <small className="error-msg mt-1" style={{ display: "block", marginBottom: 0 }}>{errors.employee_id}</small>}
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
            {errors.full_name && <small className="error-msg mt-1" style={{ display: "block", marginBottom: 0 }}>{errors.full_name}</small>}
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
            {errors.email && <small className="error-msg mt-1" style={{ display: "block", marginBottom: 0 }}>{errors.email}</small>}
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
            {errors.department && <small className="error-msg mt-1" style={{ display: "block", marginBottom: 0 }}>{errors.department}</small>}
          </div>
        </div>
        <div className="form-row">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding…" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
