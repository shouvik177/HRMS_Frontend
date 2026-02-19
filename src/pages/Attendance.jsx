import { useState } from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceList from "../components/AttendanceList";

function Attendance() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterDate, setFilterDate] = useState("");
  const [filterEmployeeId, setFilterEmployeeId] = useState("");

  return (
    <div>
      <h2 className="page-title">Attendance Management</h2>
      <AttendanceForm onMarked={() => setRefreshKey((k) => k + 1)} />
      <AttendanceList
        refreshKey={refreshKey}
        filterDate={filterDate}
        filterEmployeeId={filterEmployeeId}
        onFilterDateChange={setFilterDate}
        onFilterEmployeeChange={setFilterEmployeeId}
      />
    </div>
  );
}

export default Attendance;
