import { useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

function Employees() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <h2 className="page-title">Employee Management</h2>
      <EmployeeForm onAdded={() => setRefreshKey((k) => k + 1)} />
      <EmployeeList refreshKey={refreshKey} />
    </div>
  );
}

export default Employees;
