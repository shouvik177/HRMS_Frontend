import { useState } from "react";

const initialState = {
  employee_id: "",
  full_name: "",
  email: "",
  department: "",
};

function AddEmployeeModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(initialState);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    setFormData(initialState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-border-dark bg-card-bg p-6 shadow-card">
        <div className="mb-5 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Add Employee</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-text-secondary">Employee ID</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border-dark bg-secondary-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-grey"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-text-secondary">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border-dark bg-secondary-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-grey"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-text-secondary">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border-dark bg-secondary-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-grey"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-text-secondary">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border-dark bg-secondary-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-grey"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent-grey px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-border-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Adding..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployeeModal;
