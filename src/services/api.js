import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8010";

const api = axios.create({
  baseURL: API_BASE_URL,
  // Render free instances can cold-start and take longer than 10s.
  timeout: 30000,
});

export const employeeApi = {
  createEmployee: (payload) => api.post("/employees", payload),
  getEmployees: () => api.get("/employees"),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
};

export const attendanceApi = {
  createAttendance: (payload) => api.post("/attendance", payload),
  getAttendance: (params = {}) => api.get("/attendance", { params }),
  getAttendanceByEmployee: (employeeId) => api.get(`/attendance/${employeeId}`),
};

export const authApi = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
};

export default api;
