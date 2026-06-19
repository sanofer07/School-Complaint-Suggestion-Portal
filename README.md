# School Complaint & Suggestion Portal

A full MERN-stack platform where students submit complaints and suggestions, track status in real time, and receive direct responses from school management (Admin / Headmaster).

## Tech Stack

- **Frontend:** React.js, React Router, Tailwind CSS, Axios, React Hot Toast, React Icons
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
- **Auth:** JWT (JSON Web Tokens), bcryptjs password hashing
- **Architecture:** MVC on the backend, role-based authorization (student / admin)

## Folder Structure

```
school-portal/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/     # Route logic (auth, complaints, suggestions, users)
│   ├── middleware/      # JWT auth & role guards
│   ├── models/          # User, Complaint, Suggestion (Mongoose schemas)
│   ├── routes/          # Express routers
│   ├── seeder.js        # Creates the first admin account
│   ├── server.js        # App entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── common/     # Navbar, Footer, ProtectedRoute, StatCard, etc.
    │   │   ├── student/    # Student sidebar & layout
    │   │   └── admin/      # Admin sidebar & layout
    │   ├── context/        # AuthContext (JWT session state)
    │   ├── pages/
    │   │   ├── student/    # Dashboard, Submit Complaint/Suggestion, My Complaints, Details, Profile
    │   │   └── admin/      # Login, Dashboard, Manage Complaints/Suggestions/Users
    │   ├── utils/           # api.js (Axios endpoints), helpers.js (constants)
    │   ├── App.js            # All routes
    │   └── index.js
    ├── tailwind.config.js
    └── package.json
```

## Features

### Student
- Register / Login (JWT-secured)
- Submit Complaint (title, description, category, priority, anonymous toggle)
- Submit Suggestion
- View "My Complaints" with search & filters (status, category)
- Track complaint status on a visual progress timeline
- View admin replies on each complaint
- Edit profile & change password

### Admin (Headmaster)
- Separate Admin Login
- Dashboard with key stats (students, complaints, suggestions, pending, resolved, high priority)
- View all complaints with search & filters (status, category, priority)
- Update complaint status and add internal admin notes
- Reply directly to a student's complaint
- View & manage suggestions (status + response)
- Manage users: search, activate/deactivate, delete

### Complaint Lifecycle
- **Categories:** Infrastructure, Academics, Transport, Safety, Discipline, Hostel, Others
- **Priority:** Low, Medium, High
- **Status flow:** Submitted → Under Review → In Progress → Resolved (or Rejected)
- **Auto-generated Ticket ID:** `CMP-2026-0001`, `CMP-2026-0002`, ...
- **Anonymous complaints** display as "Anonymous Student" to the admin while still being trackable by the original submitter.

## Getting Started

### 1. Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

### 2. MongoDB Atlas Setup
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new Cluster (the free M0 tier is enough).
3. Under **Database Access**, create a database user with a username & password.
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` for development/testing).
5. Click **Connect** on your cluster → **Drivers** → copy the connection string, which looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add a database name to the URI (e.g. `school-portal`) before the `?`:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/school-portal?retryWrites=true&w=majority
   ```
7. Paste this into `backend/.env` as `MONGODB_URI`.

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGODB_URI and JWT_SECRET

npm run seed:admin      # creates default admin (admin@school.edu / admin123)
npm run dev              # starts on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start                # starts on http://localhost:3000
```

The frontend is configured with a `proxy` in `package.json` pointing to `http://localhost:5000`, so no extra env config is needed for local development.

### 5. Login
- **Student:** Register a new account at `/register`, then log in at `/login`.
- **Admin:** Go to `/admin/login` and use the seeded credentials:
  - Email: `admin@school.edu`
  - Password: `admin123`
  - **Change this password immediately after first login** via the API or by re-seeding with custom env vars (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`).

## API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register a student |
| POST | /api/auth/login | Public | Login (student or admin) |
| GET | /api/auth/me | Private | Get current user |
| PUT | /api/auth/profile | Private | Update profile |
| PUT | /api/auth/change-password | Private | Change password |
| POST | /api/complaints | Student | Submit complaint |
| GET | /api/complaints/my | Student | Get own complaints (search/filter/paginate) |
| GET | /api/complaints/:id | Owner/Admin | Get complaint by ID |
| GET | /api/complaints | Admin | Get all complaints (search/filter/paginate) |
| PUT | /api/complaints/:id/status | Admin | Update status / admin notes |
| POST | /api/complaints/:id/reply | Admin | Reply to a complaint |
| GET | /api/complaints/stats | Admin | Complaint statistics |
| POST | /api/suggestions | Student | Submit suggestion |
| GET | /api/suggestions/my | Student | Get own suggestions |
| GET | /api/suggestions | Admin | Get all suggestions |
| PUT | /api/suggestions/:id | Admin | Update suggestion status/response |
| GET | /api/users | Admin | List students (search/paginate) |
| PUT | /api/users/:id/toggle-status | Admin | Activate/Deactivate a student |
| DELETE | /api/users/:id | Admin | Delete a student |
| GET | /api/users/dashboard-stats | Admin | Dashboard summary stats |

All private routes require an `Authorization: Bearer <token>` header.

## Security
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT-based stateless authentication, 7-day expiry by default
- Role-based middleware (`adminOnly`, `studentOnly`) protecting sensitive routes
- Centralized Express error-handling middleware
- Input validation at the Mongoose schema level

## Notes
- This project ships with example data only — no seed complaints/suggestions are pre-populated besides the initial admin account.
- For production, set `NODE_ENV=production`, use a strong `JWT_SECRET`, restrict MongoDB Atlas network access, and serve the React build via a static host or behind the same Express server.
