

const STORAGE_KEYS = {
  employees: "hrms_employees",
  attendance: "hrms_attendance",
  authToken: "hrms_token",
};

const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const AUTH_REQUEST_TIMEOUT_MS = 90000;

function fetchWithTimeout(url, options = {}, timeoutMs = AUTH_REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
}

function getErrorMessage(data, fallback) {
  if (!data) return fallback || "Request failed.";
  if (data.detail) return typeof data.detail === "string" ? data.detail : (Array.isArray(data.detail) ? data.detail[0] : null) || fallback || "Request failed.";
  if (typeof data === "object") {
    const values = Object.values(data).flat();
    const first = values.find((v) => typeof v === "string");
    if (first) return first;
    const arrFirst = values.find((v) => Array.isArray(v) && v[0]);
    if (arrFirst && arrFirst[0]) return arrFirst[0];
  }
  return fallback || "Something went wrong. Check the backend and try again.";
}

export function getAuthToken() {
  return localStorage.getItem(STORAGE_KEYS.authToken);
}

function apiHeaders(includeAuth = true) {
  const headers = { "Content-Type": "application/json" };
  if (includeAuth && BASE_URL) {
    const token = getAuthToken();
    if (token) headers["Authorization"] = `Token ${token}`;
  }
  return headers;
}

export async function loginApi(email, password) {
  if (!BASE_URL) throw new Error("Backend not configured.");
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Login failed.");
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw new Error("Request timed out. The server may be waking up—please try again.");
    throw new Error(err.message || "Login failed. Check your connection and try again.");
  }
}

export async function registerApi({ name, email, password }) {
  if (!BASE_URL) throw new Error("Backend not configured.");
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Signup failed.");
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw new Error("Request timed out. The server may be waking up—please try again.");
    throw new Error(err.message || "Signup failed. Check your connection and try again.");
  }
}

export async function logoutApi() {
  if (!BASE_URL) return Promise.resolve();
  const token = getAuthToken();
  if (!token) return Promise.resolve();
  try {
    await fetch(`${BASE_URL}/api/auth/logout/`, {
      method: "POST",
      headers: apiHeaders(),
    });
  } catch {
   
  }
}

function getFromStorage(key, defaultVal = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function getEmployees() {
  if (BASE_URL) {
    let res;
    try {
      res = await fetchWithTimeout(`${BASE_URL}/api/employees/`, { headers: apiHeaders() }, 30000);
    } catch (err) {
      if (err.name === "AbortError") throw new Error("Request timed out. The server may be starting—try again.");
      throw new Error(err.message || "Failed to fetch employees. Check your connection and backend URL.");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(getErrorMessage(data, `Failed to fetch employees (${res.status}). Check backend URL.`));
    return data;
  }
  const list = getFromStorage(STORAGE_KEYS.employees);
  return Promise.resolve(list);
}

export async function addEmployee(data) {
  if (BASE_URL) {
    const res = await fetch(`${BASE_URL}/api/employees/`, {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(getErrorMessage(err));
    }
    return res.json();
  }
  const list = getFromStorage(STORAGE_KEYS.employees);
  const exists = list.some((e) => e.employee_id === data.employee_id);
  if (exists) throw new Error("Employee ID already exists");
  const newEmployee = {
    id: String(Date.now()),
    employee_id: data.employee_id.trim(),
    full_name: data.full_name.trim(),
    email: data.email.trim(),
    department: data.department.trim(),
  };
  list.push(newEmployee);
  setStorage(STORAGE_KEYS.employees, list);
  return Promise.resolve(newEmployee);
}

export async function updateEmployee(id, data) {
  if (BASE_URL) {
    const res = await fetch(`${BASE_URL}/api/employees/${id}/`, {
      method: "PUT",
      headers: apiHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(getErrorMessage(err));
    }
    return res.json();
  }
  const list = getFromStorage(STORAGE_KEYS.employees);
  const index = list.findIndex((e) => e.id === id || e.id === String(id));
  if (index === -1) throw new Error("Employee not found.");
  const updated = {
    ...list[index],
    employee_id: (data.employee_id || "").trim(),
    full_name: (data.full_name || "").trim(),
    email: (data.email || "").trim(),
    department: (data.department || "").trim(),
  };
  const exists = list.some((e) => e.id !== id && e.employee_id === updated.employee_id);
  if (exists) throw new Error("Employee ID already exists");
  list[index] = updated;
  setStorage(STORAGE_KEYS.employees, list);
  return Promise.resolve(updated);
}

export async function deleteEmployee(id) {
  if (BASE_URL) {
    const res = await fetch(`${BASE_URL}/api/employees/${id}/`, { method: "DELETE", headers: apiHeaders() });
    if (!res.ok) throw new Error("Failed to delete employee");
    return;
  }
  const list = getFromStorage(STORAGE_KEYS.employees).filter((e) => e.id !== id);
  setStorage(STORAGE_KEYS.employees, list);
  return Promise.resolve();
}

export async function getAttendance(params = {}) {
  if (BASE_URL) {
    const qs = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/api/attendance/${qs ? "?" + qs : ""}`;
    let res;
    try {
      res = await fetchWithTimeout(url, { headers: apiHeaders() }, 30000);
    } catch (err) {
      if (err.name === "AbortError") throw new Error("Request timed out. The server may be starting—try again.");
      throw new Error(err.message || "Failed to fetch attendance. Check your connection and backend URL.");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (typeof data.detail === "string" ? data.detail : null) || getErrorMessage(data, `Failed to fetch attendance (${res.status}). Check backend URL.`);
      throw new Error(msg);
    }
    return data;
  }
  const list = getFromStorage(STORAGE_KEYS.attendance);
  let result = list;
  if (params.employee_id) {
    result = result.filter((a) => a.employee_id === params.employee_id);
  }
  if (params.date) {
    result = result.filter((a) => a.date === params.date);
  }
  return Promise.resolve(result);
}

export async function markAttendance(data) {
  if (BASE_URL) {
    const res = await fetch(`${BASE_URL}/api/attendance/`, {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(getErrorMessage(err));
    }
    return res.json();
  }
  const list = getFromStorage(STORAGE_KEYS.attendance);
  const record = {
    id: String(Date.now()),
    employee_id: data.employee_id,
    date: data.date,
    status: data.status,
  };
  list.push(record);
  setStorage(STORAGE_KEYS.attendance, list);
  return Promise.resolve(record);
}
