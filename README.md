# HRMS Lite – Frontend

A lightweight Human Resource Management System (HRMS Lite) web app for managing employee records and daily attendance. This is the frontend; it works standalone with **localStorage** and can be connected to a backend API when deployed.

---

## Project overview

- **Employee management:** Add employees (Employee ID, Full Name, Email, Department), view list, delete.
- **Attendance management:** Mark attendance (Date, Status: Present/Absent), view records, filter by date and by employee.
- **Dashboard:** Summary stats (total employees, present days, present today) and a table of **present days per employee**.
- **Auth (optional):** Login and Sign up pages; Dashboard, Employees, and Attendance are available only after login. Session persists in `localStorage` until Log out.

The UI includes loading, empty, and error states and is built to work with or without a backend.

---

## Tech stack

| Layer   | Technology        |
|--------|--------------------|
| Framework | React 19          |
| Language  | JavaScript        |
| Routing   | React Router v7   |
| Build     | Vite 7            |
| Styling   | Plain CSS (variables, no UI library) |

---

## Steps to run the project locally

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Commands

```bash
# Install dependencies
npm install

# Start development server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Using a backend API

1. Create a `.env` file in the frontend root:
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```
2. Restart the dev server. The app will call your API instead of using localStorage.

Expected API shape:

- **GET** `/api/employees` → list of `{ id, employee_id, full_name, email, department }`
- **POST** `/api/employees` → body: `{ employee_id, full_name, email, department }`
- **DELETE** `/api/employees/:id`
- **GET** `/api/attendance?date=...&employee_id=...` → list of `{ id, employee_id, date, status }`
- **POST** `/api/attendance` → body: `{ employee_id, date, status }`

---

## Assumptions and limitations

1. **Authentication:** The assignment assumes a single admin (no auth). This frontend adds optional Login/Signup and protects Dashboard/Employees/Attendance behind login; auth is frontend-only until a backend is added.
2. **Data:** Without `VITE_API_URL`, all data is stored in the browser’s localStorage (no real database).
3. **Scope:** Leave management, payroll, and advanced HR features are out of scope.
4. **Browser support:** Modern browsers that support ES modules and the features used by React 19 and Vite.

---

## Bonus features implemented

- Filter attendance records by **date**.
- Filter attendance records by **employee** (view records per employee).
- **Dashboard summary:** Total employees, total present days, present today.
- **Present days per employee:** Table on the Dashboard showing each employee’s total present days.

---

## Repository structure (frontend)

```
frontend/
├── public/
├── src/
│   ├── components/    # Reusable UI (forms, lists, protected route)
│   ├── context/       # Auth state
│   ├── pages/         # Dashboard, Employees, Attendance, Login, Signup
│   ├── services/      # API layer (localStorage or fetch)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── README.md
```
