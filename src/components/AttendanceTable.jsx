function AttendanceTable({ rows }) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-border-dark bg-card-bg p-8 text-center text-text-secondary">
        No attendance records found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-dark bg-card-bg shadow-card">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-secondary-bg text-left text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Employee ID</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-t border-border-dark">
              <td className="px-4 py-3">{item.employee_name}</td>
              <td className="px-4 py-3 text-text-secondary">{item.employee_code}</td>
              <td className="px-4 py-3">{item.date}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.status === "Present"
                      ? "bg-emerald-800/60 text-emerald-200"
                      : "bg-rose-800/60 text-rose-200"
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;
