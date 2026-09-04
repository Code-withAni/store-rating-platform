# Troubleshooting Guide

## Database Connection Issues

### Problem: `ECONNREFUSED` - Connection refused

**Symptoms:**
```
✗ MySQL connection failed:
  Error: connect ECONNREFUSED 127.0.0.1:3306
  Code: ECONNREFUSED
```

**Causes:**
- MySQL server is not running
- Wrong port number
- Firewall blocking connection

**Solutions:**

1. **Check if MySQL is running:**
   ```bash
   # Windows
   sc query MySQL80  # or MySQL57, depending on your version
   
   # Or check services.msc
   ```

2. **Start MySQL:**
   ```bash
   # Windows (as Administrator)
   net start MySQL80
   ```

3. **Verify port:**
   - Default MySQL port is `3306`
   - Check your `.env` file: `DB_PORT=3306`

---

### Problem: `ER_ACCESS_DENIED_ERROR` - Access denied

**Symptoms:**
```
✗ MySQL connection failed:
  Error: Access denied for user 'root'@'localhost'
  Code: ER_ACCESS_DENIED_ERROR
```

**Causes:**
- Wrong username or password
- User doesn't have necessary permissions

**Solutions:**

1. **Verify credentials:**
   - Open `backend/.env`
   - Check `DB_USER` and `DB_PASSWORD`

2. **Reset MySQL root password:**
   ```sql
   -- Log in to MySQL as root
   mysql -u root -p
   
   -- Change password
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
   FLUSH PRIVILEGES;
   ```

3. **Grant permissions:**
   ```sql
   GRANT ALL PRIVILEGES ON store_rating_db.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Problem: `ER_NOT_SUPPORTED_AUTH_MODE` - Authentication plugin issue

**Symptoms:**
```
✗ MySQL connection failed:
  Code: ER_NOT_SUPPORTED_AUTH_MODE
```

**Cause:**
- MySQL 8+ uses `caching_sha2_password` by default
- Node.js mysql2 may have issues with this

**Solution:**
```sql
-- Log in to MySQL
mysql -u root -p

-- Change authentication method
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
FLUSH PRIVILEGES;
```

---

### Problem: `ER_BAD_DB_ERROR` - Database doesn't exist

**Symptoms:**
```
✗ MySQL connection failed:
  Code: ER_BAD_DB_ERROR
```

**Solution:**
Run the migration script:
```bash
cd backend
npm run migrate
```

---

## Migration Issues

### Problem: Migration hangs or times out

**Solutions:**

1. **Check MySQL is running:**
   ```bash
   npm run test-db
   ```

2. **Manually create database:**
   ```sql
   mysql -u root -p
   CREATE DATABASE store_rating_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Drop and recreate if corrupted:**
   ```sql
   DROP DATABASE IF EXISTS store_rating_db;
   CREATE DATABASE store_rating_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   Then run: `npm run migrate`

---

### Problem: Foreign key constraint errors

**Symptoms:**
```
Error: Cannot add foreign key constraint
```

**Solution:**
Drop all tables and re-run migration:
```sql
USE store_rating_db;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS users;
```
Then: `npm run migrate`

---

## Backend Server Issues

### Problem: Port 5000 already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Change port in `.env`:**
   ```env
   PORT=5001
   ```

2. **Kill process using port 5000:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

---

### Problem: Module not found errors

**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## Frontend Issues

### Problem: API calls failing (CORS or Network errors)

**Symptoms:**
- 404 errors on API calls
- CORS errors in browser console

**Solutions:**

1. **Check backend is running:**
   - Visit http://localhost:5000/api/health
   - Should return: `{"status":"ok"}`

2. **Check Vite proxy configuration:**
   - Open `frontend/vite.config.js`
   - Verify proxy target is `http://localhost:5000`

3. **Clear cache and restart:**
   ```bash
   cd frontend
   rm -rf node_modules .vite dist
   npm install
   npm run dev
   ```

---

### Problem: Login fails with 401 Unauthorized

**Symptoms:**
- Can't log in with admin credentials
- Immediately logged out after login

**Solutions:**

1. **Verify default admin exists:**
   ```sql
   USE store_rating_db;
   SELECT * FROM users WHERE email = 'admin@admin.com';
   ```

2. **Reset admin password:**
   ```bash
   cd backend
   npm run migrate
   ```

3. **Check JWT_SECRET in `.env`:**
   - Make sure it's set and not empty

4. **Clear localStorage:**
   - Open browser DevTools → Application → Local Storage
   - Delete all items
   - Refresh and try again

---

## Validation Errors

### Problem: "Name must be at least 8 characters"

Names must be **at least 8 characters**.

**Example valid names:**
- ✓ "John Doe" (8 chars)
- ✓ "Jane Smith" (10 chars)
- ✗ "John" (4 chars - too short)

---

### Problem: Password validation failing

**Requirements:**
- 8–16 characters
- At least 1 uppercase letter
- At least 1 special character (!@#$%^&*()_+=-[]{}|:;"'<>,.?/)

**Example valid passwords:**
- ✓ `Admin@123`
- ✓ `Pass#word1`
- ✗ `password` (no uppercase, no special char)
- ✗ `Password` (no special char)

---

## Testing & Debugging

### Run connection test
```bash
cd backend
npm run test-db
```

### Check server logs
The backend logs all requests and errors to console. Watch for:
- `✓ MySQL database connected successfully`
- `🚀 Store Rating API Server Started`

### Check database directly
```bash
mysql -u root -p
USE store_rating_db;
SHOW TABLES;
SELECT * FROM users;
```

### Test API endpoints with curl
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"Admin@123"}'
```

---

## Still having issues?

1. Run the connection test: `npm run test-db`
2. Check all environment variables in `.env`
3. Verify MySQL version: `mysql --version` (should be 5.7+ or 8.0+)
4. Check Node.js version: `node --version` (should be v18+)
5. Review error logs in terminal

If the issue persists, provide:
- Full error message
- Output of `npm run test-db`
- MySQL version
- Node.js version
