import { useEffect, useState } from "react";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EmployeeTable from "../components/EmployeeTable";
import { employeeApi } from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await employeeApi.getEmployees();
      setEmployees(response.data);
    } catch (apiError) {
      setError(apiError.response?.data?.detail || "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAddEmployee = async (payload) => {
    setIsSubmitting(true);
    setError("");
    try {
      await employeeApi.createEmployee(payload);
      setIsModalOpen(false);
      await loadEmployees();
    } catch (apiError) {
      setError(apiError.response?.data?.detail || "Failed to add employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      await employeeApi.deleteEmployee(id);
      await loadEmployees();
    } catch (apiError) {
      setError(apiError.response?.data?.detail || "Failed to delete employee.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Employees</h3>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-accent-grey px-4 py-2 text-sm font-medium transition hover:bg-border-dark"
        >
          Add Employee
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-700/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-border-dark bg-card-bg p-8 text-center text-text-secondary">
          Loading employees...
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onDelete={handleDeleteEmployee}
          deletingId={deletingId}
        />
      )}

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEmployee}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}

export default Employees;
