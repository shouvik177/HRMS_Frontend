function EmployeeTable({ employees, onDelete, deletingId }) {
  if (!employees.length) {
    return (
      <div className="rounded-2xl border border-border-dark bg-card-bg p-8 text-center text-text-secondary">
        No employees found yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-dark bg-card-bg shadow-card">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-secondary-bg text-left text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">Employee ID</th>
            <th className="px-4 py-3 font-medium">Full Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-t border-border-dark">
              <td className="px-4 py-3">{employee.employee_id}</td>
              <td className="px-4 py-3">{employee.full_name}</td>
              <td className="px-4 py-3 text-text-secondary">{employee.email}</td>
              <td className="px-4 py-3">{employee.department}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onDelete(employee.id)}
                  disabled={deletingId === employee.id}
                  className="rounded-lg border border-border-dark bg-accent-grey px-3 py-1.5 text-xs font-medium text-text-primary transition hover:bg-border-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === employee.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
