# Debugging Features Added

This document outlines all the debugging and connection verification features added to the Store Rating App.

## 1. Enhanced Database Connection Logging (`backend/src/config/db.js`)

**Features:**
- ✅ Automatic connection test on startup
- ✅ Colored success/error indicators (✓ / ✗)
- ✅ Detailed connection info (host, port, database name)
- ✅ Specific error codes with helpful messages
- ✅ Actionable troubleshooting hints

**Example Output (Success):**
```
✓ MySQL database connected successfully
  Host: localhost:3306
  Database: store_rating_db
```

**Example Output (Error):**
```
✗ MySQL connection failed:
  Error: connect ECONNREFUSED 127.0.0.1:3306
  Code: ECONNREFUSED
  → Make sure MySQL server is running
```

---

## 2. Enhanced Server Startup Logging (`backend/src/app.js`)

**Features:**
- ✅ Formatted startup banner
- ✅ Clickable server URLs
- ✅ Health check endpoint URL
- ✅ Clear instructions for stopping server

**Example Output:**
```
═══════════════════════════════════════════════
  🚀 Store Rating API Server Started
═══════════════════════════════════════════════
  ➜ Local:   http://localhost:5000
  ➜ Health:  http://localhost:5000/api/health

  Press Ctrl+C to stop
═══════════════════════════════════════════════
```

---

## 3. Enhanced Migration Script (`backend/src/config/migrate.js`)

**Features:**
- ✅ Step-by-step progress indicators
- ✅ Connection verification before migration
- ✅ Detailed error messages with solutions
- ✅ Success confirmation with summary
- ✅ Shows if admin already exists vs newly created

**Example Output (Success):**
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

**Example Output (Error):**
```
═══════════════════════════════════════════════
  ❌ Migration failed!
═══════════════════════════════════════════════
  Error: connect ECONNREFUSED 127.0.0.1:3306
  Code: ECONNREFUSED

  → MySQL server is not running
  → Start MySQL and try again
```

---

## 4. Connection Test Script (`backend/test-connection.js`)

**Purpose:** Independent tool to verify MySQL connection without running migrations or starting the server.

**Usage:**
```bash
cd backend
npm run test-db
```

**Tests Performed:**
1. ✅ Connect to MySQL server
2. ✅ Check if database exists
3. ✅ Connect to specific database
4. ✅ List all tables
5. ✅ Provide actionable feedback

**Example Output (All Tests Pass):**
```
═══════════════════════════════════════════════
  🔍 Testing MySQL Connection...
═══════════════════════════════════════════════
  Host: localhost:3306
  User: root
  Database: store_rating_db

Test 1: Connecting to MySQL server...
✓ MySQL server is accessible

Test 2: Checking if database exists...
✓ Database 'store_rating_db' exists

Test 3: Connecting to database...
✓ Successfully connected to 'store_rating_db'

Test 4: Checking tables...
✓ Found 3 tables:
  - users
  - stores
  - ratings

═══════════════════════════════════════════════
  ✅ Connection test completed!
═══════════════════════════════════════════════
```

**Example Output (Database Not Found):**
```
Test 2: Checking if database exists...
⚠ Database 'store_rating_db' does not exist
  Run: npm run migrate
```

**Error Diagnostics:**
The script provides specific solutions for:
- `ECONNREFUSED` → MySQL not running
- `ER_ACCESS_DENIED_ERROR` → Wrong credentials
- `ER_NOT_SUPPORTED_AUTH_MODE` → Authentication mode issue
- `ENOTFOUND` → Hostname resolution problem

---

## 5. Comprehensive Troubleshooting Guide (`TROUBLESHOOTING.md`)

**Covers:**
- Database connection issues (all error codes)
- Migration problems
- Backend server issues (port conflicts, missing modules)
- Frontend issues (API calls, CORS, login)
- Validation errors (with examples)
- Testing & debugging commands

**Quick Access:**
```bash
# From project root
cat TROUBLESHOOTING.md

# Or view in GitHub/editor
```

---

## 6. Updated NPM Scripts

### Backend (`backend/package.json`)

```json
{
  "scripts": {
    "start": "node src/app.js",          // Production server
    "dev": "nodemon src/app.js",         // Dev server with auto-reload
    "migrate": "node src/config/migrate.js",  // Run migrations
    "test-db": "node test-connection.js"      // Test MySQL connection
  }
}
```

### Quick Commands

| What to Do | Command |
|------------|---------|
| Test database connection | `npm run test-db` |
| Run migration | `npm run migrate` |
| Start development server | `npm run dev` |
| Start production server | `npm start` |

---

## 7. Error Code Reference

### Common MySQL Error Codes

| Code | Meaning | Quick Fix |
|------|---------|-----------|
| `ECONNREFUSED` | MySQL not running | Start MySQL service |
| `ER_ACCESS_DENIED_ERROR` | Wrong credentials | Check .env DB_USER/DB_PASSWORD |
| `ER_NOT_SUPPORTED_AUTH_MODE` | Auth plugin issue | Use mysql_native_password |
| `ER_BAD_DB_ERROR` | Database doesn't exist | Run `npm run migrate` |
| `ENOTFOUND` | Can't resolve hostname | Use localhost or 127.0.0.1 |

---

## 8. Debugging Workflow

### Recommended troubleshooting order:

1. **Test connection:**
   ```bash
   cd backend
   npm run test-db
   ```

2. **If connection fails:**
   - Check if MySQL is running
   - Verify `.env` credentials
   - See TROUBLESHOOTING.md for specific error

3. **Run migration:**
   ```bash
   npm run migrate
   ```

4. **Start backend:**
   ```bash
   npm run dev
   ```
   - Watch for "✓ MySQL database connected successfully"

5. **Start frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Test the app:**
   - Open http://localhost:3000
   - Login with admin@admin.com / Admin@123

---

## Benefits

✅ **Faster debugging:** Clear error messages with solutions
✅ **Better DX:** Immediate feedback on connection status
✅ **Self-service:** Users can diagnose issues without external help
✅ **Professional output:** Clean, formatted console messages
✅ **Time-saving:** `test-db` script checks everything in seconds

---

## Files Modified/Added

### Modified:
- `backend/src/config/db.js` - Added connection test
- `backend/src/app.js` - Enhanced startup logging
- `backend/src/config/migrate.js` - Added progress indicators & error handling
- `backend/package.json` - Added `test-db` and `migrate` scripts
- `README.md` - Added debugging sections

### Added:
- `backend/test-connection.js` - Standalone connection test tool
- `TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- `DEBUGGING-FEATURES.md` - This document

---

## Future Enhancements (Optional)

- [ ] Add health check endpoint with detailed status
- [ ] Log API requests with timestamps
- [ ] Add database query logging in development mode
- [ ] Create admin panel for viewing logs
- [ ] Add email notifications for errors (production)
