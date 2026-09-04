# Quick Start Guide

Get the Store Rating App running in 5 minutes with realistic test data.

## Prerequisites

- ✅ Node.js v18+ installed
- ✅ MySQL 8+ installed and running
- ✅ Git (optional)

---

## 1. Setup Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure database (edit .env with your MySQL password)
# DB_USER=root
# DB_PASSWORD=yourpassword

# Test MySQL connection (optional)
npm run test-db

# Create database and tables
npm run migrate

# Add dummy data (2 admins, 5 owners, 10 users, 8 stores, 40+ ratings)
npm run seed

# Start backend server
npm run dev
```

**Expected:** Server running on http://localhost:5000

---

## 2. Setup Frontend (1 minute)

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected:** App running on http://localhost:3000

---

## 3. Test the App (2 minutes)

### Test as Admin
1. Open http://localhost:3000
2. Login: `admin@admin.com` / `Admin@123`
3. Explore:
   - Dashboard → See 17 users, 8 stores, 40+ ratings
   - Users → Filter by role (admin/user/owner)
   - Stores → View with ratings
   - Add new user/store

### Test as Normal User
1. Logout (click logout button)
2. Login: `alice@gmail.com` / `User@1234`
3. Explore:
   - View 8 stores with ratings
   - See YOUR ratings (Alice has rated 3 stores)
   - Rate a new store
   - Modify existing rating

### Test as Store Owner
1. Logout
2. Login: `michael.owner@gmail.com` / `Owner@123`
3. View:
   - Your store: "Fresh Mart Grocery Store"
   - Average rating: ~4.67
   - 6 users who rated your store

### Test Registration
1. Logout
2. Click "Sign up"
3. Register new user:
   - Name: **minimum 8 characters**
   - Email: your@email.com
   - Address: any text
   - Password: **8–16 chars, 1 uppercase, 1 special**
   - Example: `User@1234`
4. Login with new account

---

## All Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@admin.com | Admin@123 |
| Admin | sarah.admin@storerate.com | Admin@123 |
| Owner | michael.owner@gmail.com | Owner@123 |
| Owner | emily.owner@gmail.com | Owner@123 |
| Owner | david.owner@gmail.com | Owner@123 |
| User | alice@gmail.com | User@1234 |
| User | bob@gmail.com | User@1234 |
| User | carol@gmail.com | User@1234 |

**Note:** All 10 normal users use password `User@1234`

See [DUMMY-DATA.md](DUMMY-DATA.md) for complete list.

---

## Troubleshooting

### "Can't connect to MySQL"
```bash
cd backend
npm run test-db  # Diagnose connection
```

Common fixes:
- Start MySQL server
- Check `.env` credentials
- Update `DB_PASSWORD`

### "Database doesn't exist"
```bash
npm run migrate  # Creates database
```

### "No data in app"
```bash
npm run seed  # Adds dummy data
```

### "Port 5000 already in use"
Edit `backend/.env`:
```
PORT=5001
```

### "Validation errors"
- Name: minimum **8 characters** (e.g., "John Doe")
- Password: **8–16 chars**, 1 uppercase, 1 special (e.g., "User@1234")

---

## Reset Everything

```bash
# Backend
cd backend
npm run seed  # Clears all data, re-adds dummy data

# Or full reset
npm run migrate  # Recreate tables
npm run seed     # Add dummy data
```

---

## What's Included

After seeding, you'll have:

✅ **2 Admins** - Full system access
✅ **5 Store Owners** - Each owns a store, can view ratings
✅ **10 Normal Users** - Can browse and rate stores
✅ **8 Stores** - Grocery, electronics, fashion, books, etc.
✅ **40+ Ratings** - Distributed across stores (ratings 1-5)

All with realistic names, addresses, and emails.

---

## Development Workflow

```bash
# Terminal 1 - Backend (auto-reloads on changes)
cd backend
npm run dev

# Terminal 2 - Frontend (auto-reloads on changes)
cd frontend
npm run dev

# Terminal 3 - Database operations
cd backend
npm run seed      # Reset data
npm run test-db   # Test connection
npm run migrate   # Recreate tables
```

---

## API Health Check

Backend running? Test:
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

---

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [DUMMY-DATA.md](DUMMY-DATA.md) for all test scenarios
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- Review [DEBUGGING-FEATURES.md](DEBUGGING-FEATURES.md) for development tools

---

## One-Line Setup (if database is already configured)

```bash
cd backend && npm i && npm run migrate && npm run seed && npm run dev &
cd ../frontend && npm i && npm run dev
```

Then open http://localhost:3000 and login as `admin@admin.com` / `Admin@123`

---

## Summary

✅ Backend: Express.js + MySQL with JWT auth
✅ Frontend: React + Vite with role-based routing  
✅ Features: Dashboard, user management, store ratings, filtering, sorting
✅ Roles: Admin (manage all), Owner (view store ratings), User (rate stores)
✅ Test Data: 17 users, 8 stores, 40+ ratings ready to explore

**Total setup time: ~5 minutes** ⚡

Happy testing! 🚀
