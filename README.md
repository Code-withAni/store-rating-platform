# Store Rating Platform

A full-stack web application for rating stores, built with Express.js, MySQL, and React.js.

## 🚀 Quick Start

**Want to get started immediately?** See **[QUICK-START.md](QUICK-START.md)** for a 5-minute setup with dummy data.

```bash
cd backend && npm i && npm run migrate && npm run seed && npm run dev
# New terminal: cd frontend && npm i && npm run dev
# Open http://localhost:3000 → Login: admin@admin.com / Admin@123
```

---

## Tech Stack

- **Backend:** Express.js + MySQL (mysql2)
- **Frontend:** React.js + Vite
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** express-validator (backend), custom validators (frontend)
- **Styling:** Custom CSS (no framework)

---

## Project Structure

```
store-rating-app/
├── backend/          # Express.js API
│   ├── src/
│   │   ├── config/   # DB connection & migration
│   │   ├── controllers/
│   │   ├── middleware/  # JWT auth + role guards
│   │   ├── routes/
│   │   └── validators/
│   └── .env
└── frontend/         # React + Vite
    └── src/
        ├── api/        # Axios instance
        ├── components/ # Shared components
        ├── context/    # Auth context
        ├── pages/      # admin / user / owner pages
        └── utils/      # Client-side validators
```

---

## Setup

### Prerequisites

- Node.js v18+
- MySQL 8+

### 1. Configure the database

Make sure MySQL is running. Update `backend/.env` with your credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=store_rating_db
JWT_SECRET=store_rating_jwt_secret_2024_secure_key
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:4173
```

> **Note:** The default DB_NAME in `.env.example` is `store_rating_db`. You can change it to any name (e.g. `assignment`), but the name must match between `.env` and the migration script.

**Test your MySQL connection** (optional but recommended):
```bash
cd backend
npm install
npm run test-db
```

This will verify:
- ✓ MySQL server is accessible
- ✓ Credentials are correct
- ✓ Database exists (or prompt to run migration)
- ✓ Tables are created

### 2. Run database migration

This creates the database, tables, and a default admin account.

```bash
cd backend
npm install
npm run migrate
```

**Expected output:**
```
═══════════════════════════════════════════════
  📦 Database Migration Starting...
═══════════════════════════════════════════════
  Host: localhost:3306
  Database: store_rating_db

✓ MySQL server connected successfully

✓ Database 'store_rating_db' ensured
✓ Table users ensured
✓ Table stores ensured
✓ Table ratings ensured
✓ Default admin created: admin@admin.com / Admin@123

═══════════════════════════════════════════════
  ✅ Migration completed successfully!
═══════════════════════════════════════════════
```

Default admin credentials:
- **Email:** `admin@admin.com`
- **Password:** `Admin@123`

### 2b. Seed dummy data (optional but recommended)

This adds realistic test data: 2 admins, 5 store owners, 10 users, 8 stores, and 40+ ratings.

```bash
npm run seed
```

**Expected output:**
```
═══════════════════════════════════════════════
  🌱 Seeding Dummy Data...
═══════════════════════════════════════════════

✓ Connected to database: store_rating_db

Clearing existing data...
✓ Tables cleared

Inserting users...
✓ 2 admin users inserted
✓ 5 store owners inserted
✓ 10 normal users inserted

Inserting stores...
✓ 8 stores inserted

Inserting ratings...
✓ 40 ratings inserted

Store Rating Summary:
─────────────────────────────────────────────
  ★★★★★  4.67  (6 ratings)   Fresh Mart Grocery Store
  ★★★★★  4.50  (2 ratings)   Organic Bliss Health Store
  ★★★★★  4.40  (5 ratings)   Tech Galaxy Electronics Hub
  ...

═══════════════════════════════════════════════
  ✅ Seeding completed successfully!
═══════════════════════════════════════════════

  Test Credentials:
  ─────────────────────────────────────────────
  Admin:       admin@admin.com           / Admin@123
  Owner 1:     michael.owner@gmail.com   / Owner@123
  Normal User: alice@gmail.com           / User@1234
```

**Test accounts after seeding:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@admin.com | Admin@123 |
| Admin | sarah.admin@storerate.com | Admin@123 |
| Owner | michael.owner@gmail.com | Owner@123 |
| Owner | emily.owner@gmail.com | Owner@123 |
| User | alice@gmail.com | User@1234 |
| User | bob@gmail.com | User@1234 |

_(All 10 normal users use password: `User@1234`)_

**Troubleshooting:**
- If you see `ECONNREFUSED`: MySQL server is not running — start MySQL first
- If you see `ER_ACCESS_DENIED_ERROR`: Check your DB_USER and DB_PASSWORD in `.env`
- If you see `ER_NOT_SUPPORTED_AUTH_MODE`: Run this in MySQL:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
  ```
- **For more help, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

**Want to explore with test data?** See [DUMMY-DATA.md](DUMMY-DATA.md) for all test accounts and scenarios.

### 3. Start the backend

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Expected output:**
```
✓ MySQL database connected successfully
  Host: localhost:3306
  Database: store_rating_db

═══════════════════════════════════════════════
  🚀 Store Rating API Server Started
═══════════════════════════════════════════════
  ➜ Local:   http://localhost:5000
  ➜ Health:  http://localhost:5000/api/health

  Press Ctrl+C to stop
═══════════════════════════════════════════════
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

---

## User Roles & Access

| Role | Login | Register | Capabilities |
|------|-------|----------|-------------|
| **Admin** | ✅ | ❌ (admin creates) | Dashboard stats, manage users & stores, view any store's ratings, edit store details/owner |
| **Normal User** | ✅ | ✅ | Browse stores, submit/edit ratings, change password |
| **Store Owner** | ✅ | ❌ (admin creates) | View store ratings dashboard with stat cards, change password |

---

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Normal user signup |
| POST | `/api/auth/login` | Public | Login (all roles) |
| POST | `/api/auth/change-password` | Any role | Change own password |

> **Real-time filtering:** The Users and Stores pages filter results automatically as you type (300ms debounce). No "Search" button needed.

### Admin
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | Stats: users, stores, ratings |
| GET | `/api/admin/users` | List users (filter by `?name=`, `?email=`, `?role=`, `?address=`) |
| POST | `/api/admin/users` | Create user (any role) |
| GET | `/api/admin/users/:id` | User detail (+ avg rating if owner) |
| GET | `/api/admin/stores` | List stores with avg rating (filter by `?name=`, `?email=`, `?address=`) |
| GET | `/api/admin/stores/:id` | Store detail + all customer ratings |
| PUT | `/api/admin/stores/:id` | Update store (name, email, address, owner) |
| POST | `/api/admin/stores` | Create store |

### User
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/user/stores` | List stores + user's ratings |
| POST | `/api/user/ratings` | Submit a rating |
| PUT | `/api/user/ratings/:id` | Update a rating |

### Owner
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/owner/dashboard` | Store info, avg rating, raters list |

---

## Validation Rules

| Field | Rule |
|-------|------|
| Name | 8–60 characters |
| Address | Max 400 characters |
| Password | 8–16 chars, ≥1 uppercase, ≥1 special character |
| Email | Standard email format |
| Rating | Integer 1–5 |

---

## Database Schema

```sql
users (id, name, email, password, address, role, created_at)
stores (id, name, email, address, owner_id → users.id, created_at)
ratings (id, user_id → users.id, store_id → stores.id, rating, created_at)
  UNIQUE(user_id, store_id)  -- one rating per user per store
```

---

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run migrate` | Run database migration (creates DB + tables) |
| `npm run seed` | Seed dummy data (users, stores, ratings) |
| `npm run test-db` | Test MySQL connection and database state |
| `npm run check-data` | Print all database contents to console |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## Troubleshooting

Having issues? Check the **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** guide for:
- Database connection problems
- Migration issues
- Authentication errors
- Common validation errors
- Step-by-step debugging

Quick test: `cd backend && npm run test-db`
