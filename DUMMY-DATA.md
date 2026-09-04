# Dummy Data Reference

This document describes all the test accounts and data added by the seed script.

## How to Seed

```bash
cd backend

# First time setup
npm run migrate   # Creates database and tables
npm run seed      # Adds dummy data

# Re-seed (replaces all data)
npm run seed
```

**Note:** `npm run seed` will **clear all existing data** and replace it with dummy data.

---

## Test Accounts

### Admins (2 accounts)

| Name | Email | Password |
|------|-------|----------|
| System Administrator | admin@admin.com | Admin@123 |
| Sarah Johnson Admin | sarah.admin@storerate.com | Admin@123 |

**Capabilities:**
- View dashboard stats
- Manage all users and stores
- Add new users (any role)
- Add new stores
- View all ratings

---

### Store Owners (5 accounts)

| Name | Email | Password | Store |
|------|-------|----------|-------|
| Michael Thompson Owner | michael.owner@gmail.com | Owner@123 | Fresh Mart Grocery Store |
| Emily Rodriguez Owner | emily.owner@gmail.com | Owner@123 | Tech Galaxy Electronics Hub |
| David Kim Store Owner | david.owner@gmail.com | Owner@123 | Fashion Forward Clothing Store |
| Jessica Brown Owner | jessica.owner@gmail.com | Owner@123 | BookNest Reading Paradise |
| Robert Wilson Store Owner | robert.owner@gmail.com | Owner@123 | Home Comfort Furniture World |

**Capabilities:**
- View their store's ratings dashboard
- See average rating
- See list of users who rated
- Change password

---

### Normal Users (10 accounts)

All use password: **`User@1234`**

| Name | Email |
|------|-------|
| Alice Martinez User | alice@gmail.com |
| Bob Anderson Normal | bob@gmail.com |
| Carol White Regular | carol@gmail.com |
| Daniel Harris Shopper | daniel@gmail.com |
| Eva Clark Regular User | eva@gmail.com |
| Frank Lewis Normal User | frank@gmail.com |
| Grace Walker Reviewer | grace@gmail.com |
| Henry Hall Regular Customer | henry@gmail.com |
| Isabella Young Normal User | isabella@gmail.com |
| James Scott Shopper | james@gmail.com |

**Capabilities:**
- Browse all stores
- Submit ratings (1–5 stars)
- Modify their own ratings
- Search stores by name/address
- Change password

---

## Stores (8 total)

| Store Name | Email | Owner | Avg Rating | # Ratings |
|------------|-------|-------|------------|-----------|
| Fresh Mart Grocery Store | freshmart@store.com | Michael | ~4.67 | 6 |
| Tech Galaxy Electronics Hub | techgalaxy@store.com | Emily | ~4.40 | 5 |
| Fashion Forward Clothing Store | fashionforward@store.com | David | ~3.60 | 5 |
| BookNest Reading Paradise | booknest@store.com | Jessica | ~4.60 | 5 |
| Home Comfort Furniture World | homecomfort@store.com | Robert | ~3.50 | 4 |
| Organic Bliss Health Store | organicbliss@store.com | *(no owner)* | ~4.50 | 4 |
| Sports Zone Athletic Gear | sportszone@store.com | *(no owner)* | ~4.33 | 3 |
| Pet Paradise Animal Store | petparadise@store.com | *(no owner)* | ~4.00 | 4 |

**Note:** 3 stores have no owner assigned (owner_id = NULL), which is valid.

---

## Ratings Distribution

**40+ ratings total** distributed across all stores.

### Sample Ratings:

**Fresh Mart** (6 ratings, avg 4.67):
- Alice: 5 stars
- Bob: 4 stars
- Carol: 5 stars
- Daniel: 3 stars
- Eva: 4 stars
- Frank: 5 stars

**Tech Galaxy** (5 ratings, avg 4.40):
- Alice: 4 stars
- Bob: 5 stars
- Grace: 4 stars
- Henry: 3 stars
- Isabella: 5 stars

**BookNest** (5 ratings, avg 4.60):
- Alice: 5 stars
- Daniel: 5 stars
- Frank: 4 stars
- Henry: 5 stars
- James: 4 stars

---

## Testing Scenarios

### Scenario 1: Admin Dashboard
1. Login as: `admin@admin.com` / `Admin@123`
2. Should see:
   - Total users: 17 (2 admins + 5 owners + 10 users)
   - Total stores: 8
   - Total ratings: 40+

### Scenario 2: View and Filter Users
1. Login as admin
2. Navigate to Users page
3. Filter by:
   - Role: "owner" → Should show 5 owners
   - Name: "Alice" → Should find Alice Martinez
   - Email: "@gmail.com" → Should show most users

### Scenario 3: View Stores with Ratings
1. Login as admin
2. Navigate to Stores page
3. Should see all 8 stores with average ratings
4. Sort by rating (high to low)

### Scenario 4: User Rating Experience
1. Login as: `alice@gmail.com` / `User@1234`
2. View stores page
3. Should see:
   - Fresh Mart with YOUR rating: 5 stars
   - Tech Galaxy with YOUR rating: 4 stars
   - BookNest with YOUR rating: 5 stars
   - Other stores: can rate them
4. Try modifying Alice's rating for Fresh Mart

### Scenario 5: Owner Dashboard
1. Login as: `michael.owner@gmail.com` / `Owner@123`
2. Should see:
   - Store: Fresh Mart Grocery Store
   - Average rating: ~4.67
   - List of 6 users who rated (Alice, Bob, Carol, Daniel, Eva, Frank)
   - Each with their rating and timestamp

### Scenario 6: User with No Ratings Yet
1. Login as: `grace@gmail.com` / `User@1234`
2. Grace only rated 3 stores
3. Should see:
   - Some stores with HER ratings
   - Other stores without ratings (can rate them)

### Scenario 7: Store with No Owner
1. Login as admin
2. View store "Organic Bliss Health Store"
3. Owner field should be empty/null
4. Store still has ratings from users

### Scenario 8: Multiple Admins
1. Login as: `sarah.admin@storerate.com` / `Admin@123`
2. Should have same admin privileges
3. Can manage all users and stores

---

## Re-seeding

To clear all data and start fresh:

```bash
cd backend
npm run seed
```

This will:
- ✓ Clear all ratings
- ✓ Clear all stores
- ✓ Clear all users
- ✓ Re-insert all dummy data
- ✓ Show summary with ratings

**Warning:** This permanently deletes all existing data!

---

## Customizing Dummy Data

To modify the seed data, edit `backend/src/config/seed.js`:

```js
// Add more users
const normalUsers = [
  {
    name: 'Your Name Here',
    email: 'yourname@gmail.com',
    password: 'User@1234',
    address: 'Your Address',
    role: 'user',
  },
  // ... existing users
];

// Add more stores
const stores = [
  {
    name: 'Your Store Name Here',
    email: 'yourstore@store.com',
    address: 'Store Address',
    owner_email: 'owner@gmail.com', // or null
  },
  // ... existing stores
];

// Add more ratings
const ratings = [
  ['user@email.com', 'store@email.com', 5],
  // ... existing ratings
];
```

Then run: `npm run seed`

---

## Database Queries for Verification

```sql
-- Count users by role
SELECT role, COUNT(*) AS count FROM users GROUP BY role;

-- Show all stores with ratings
SELECT s.name, ROUND(AVG(r.rating), 2) AS avg_rating, COUNT(r.id) AS total_ratings
FROM stores s
LEFT JOIN ratings r ON r.store_id = s.id
GROUP BY s.id, s.name;

-- Show who rated what
SELECT u.name AS user, s.name AS store, r.rating
FROM ratings r
JOIN users u ON u.id = r.user_id
JOIN stores s ON s.id = r.store_id
ORDER BY s.name, u.name;

-- Find stores without owners
SELECT name, email FROM stores WHERE owner_id IS NULL;
```

---

## Quick Start Testing Guide

```bash
# 1. Setup database
cd backend
npm run migrate

# 2. Add dummy data
npm run seed

# 3. Start backend
npm run dev

# 4. Start frontend (new terminal)
cd ../frontend
npm run dev

# 5. Open browser
# http://localhost:3000

# 6. Login as admin
# Email: admin@admin.com
# Password: Admin@123

# 7. Explore:
# - Dashboard → see stats
# - Users → filter by role
# - Stores → see ratings
# - Add new user/store

# 8. Login as normal user
# Email: alice@gmail.com
# Password: User@1234

# 9. Browse stores and rate them

# 10. Login as owner
# Email: michael.owner@gmail.com
# Password: Owner@123

# 11. View your store's ratings
```

---

## Summary

- **17 total users** (2 admins, 5 owners, 10 normal users)
- **8 stores** (5 with owners, 3 without)
- **40+ ratings** (distributed across users and stores)
- **Realistic data** (names, addresses, emails)
- **Ready to test** all app features immediately

Run `npm run seed` anytime to reset data to this baseline.
