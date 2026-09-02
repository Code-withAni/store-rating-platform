const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const adminUsers = [
  {
    name: 'System Administrator',
    email: 'admin@admin.com',
    password: 'Admin@123',
    address: '100 Admin Headquarters, New York, NY 10001',
    role: 'admin',
  },
  {
    name: 'Sarah Johnson Administrator',
    email: 'sarah.admin@storerate.com',
    password: 'Admin@123',
    address: '200 Corporate Avenue, Los Angeles, CA 90001',
    role: 'admin',
  },
];

const storeOwners = [
  {
    name: 'Michael Thompson Owner',
    email: 'michael.owner@gmail.com',
    password: 'Owner@123',
    address: '45 Maple Street, Chicago, IL 60601',
    role: 'owner',
  },
  {
    name: 'Emily Rodriguez Owner',
    email: 'emily.owner@gmail.com',
    password: 'Owner@123',
    address: '78 Oak Avenue, Houston, TX 77001',
    role: 'owner',
  },
  {
    name: 'David Kim Store Owner',
    email: 'david.owner@gmail.com',
    password: 'Owner@123',
    address: '123 Pine Road, Phoenix, AZ 85001',
    role: 'owner',
  },
  {
    name: 'Jessica Brown Store Owner',
    email: 'jessica.owner@gmail.com',
    password: 'Owner@123',
    address: '56 Cedar Lane, Philadelphia, PA 19101',
    role: 'owner',
  },
  {
    name: 'Robert Wilson Store Owner',
    email: 'robert.owner@gmail.com',
    password: 'Owner@123',
    address: '89 Birch Boulevard, San Antonio, TX 78201',
    role: 'owner',
  },
];

const normalUsers = [
  {
    name: 'Alice Martinez Regular User',
    email: 'alice@gmail.com',
    password: 'User@1234',
    address: '12 Elm Street, San Diego, CA 92101',
    role: 'user',
  },
  {
    name: 'Bob Anderson Normal User',
    email: 'bob@gmail.com',
    password: 'User@1234',
    address: '34 Walnut Drive, Dallas, TX 75201',
    role: 'user',
  },
  {
    name: 'Carol White Regular User',
    email: 'carol@gmail.com',
    password: 'User@1234',
    address: '67 Spruce Court, San Jose, CA 95101',
    role: 'user',
  },
  {
    name: 'Daniel Harris Shopper',
    email: 'daniel@gmail.com',
    password: 'User@1234',
    address: '90 Willow Way, Austin, TX 78701',
    role: 'user',
  },
  {
    name: 'Eva Clark Regular User',
    email: 'eva@gmail.com',
    password: 'User@1234',
    address: '23 Poplar Street, Jacksonville, FL 32099',
    role: 'user',
  },
  {
    name: 'Frank Lewis Normal User',
    email: 'frank@gmail.com',
    password: 'User@1234',
    address: '45 Chestnut Avenue, Columbus, OH 43085',
    role: 'user',
  },
  {
    name: 'Grace Walker Reviewer',
    email: 'grace@gmail.com',
    password: 'User@1234',
    address: '78 Magnolia Lane, Charlotte, NC 28201',
    role: 'user',
  },
  {
    name: 'Henry Hall Regular Customer',
    email: 'henry@gmail.com',
    password: 'User@1234',
    address: '12 Sycamore Road, Indianapolis, IN 46201',
    role: 'user',
  },
  {
    name: 'Isabella Young Normal User',
    email: 'isabella@gmail.com',
    password: 'User@1234',
    address: '56 Dogwood Drive, San Francisco, CA 94102',
    role: 'user',
  },
  {
    name: 'James Scott Regular Shopper',
    email: 'james@gmail.com',
    password: 'User@1234',
    address: '89 Hickory Court, Seattle, WA 98101',
    role: 'user',
  },
];

const stores = [
  {
    name: 'Fresh Mart Grocery Store',
    email: 'freshmart@store.com',
    address: '100 Market Street, New York, NY 10001',
    owner_email: 'michael.owner@gmail.com',
  },
  {
    name: 'Tech Galaxy Electronics Hub',
    email: 'techgalaxy@store.com',
    address: '250 Silicon Avenue, San Jose, CA 95101',
    owner_email: 'emily.owner@gmail.com',
  },
  {
    name: 'Fashion Forward Clothing Store',
    email: 'fashionforward@store.com',
    address: '75 Style Boulevard, Los Angeles, CA 90001',
    owner_email: 'david.owner@gmail.com',
  },
  {
    name: 'BookNest Reading Paradise',
    email: 'booknest@store.com',
    address: '30 Literary Lane, Chicago, IL 60601',
    owner_email: 'jessica.owner@gmail.com',
  },
  {
    name: 'Home Comfort Furniture World',
    email: 'homecomfort@store.com',
    address: '500 Decor Drive, Houston, TX 77001',
    owner_email: 'robert.owner@gmail.com',
  },
  {
    name: 'Organic Bliss Health Store',
    email: 'organicbliss@store.com',
    address: '88 Wellness Way, Austin, TX 78701',
    owner_email: null,
  },
  {
    name: 'Sports Zone Athletic Gear',
    email: 'sportszone@store.com',
    address: '45 Champion Circle, Dallas, TX 75201',
    owner_email: null,
  },
  {
    name: 'Pet Paradise Animal Store',
    email: 'petparadise@store.com',
    address: '200 Paws Avenue, Phoenix, AZ 85001',
    owner_email: null,
  },
];

// Ratings: [userEmail, storeEmail, rating]
const ratings = [
  // Fresh Mart
  ['alice@gmail.com',    'freshmart@store.com',       5],
  ['bob@gmail.com',      'freshmart@store.com',       4],
  ['carol@gmail.com',    'freshmart@store.com',       5],
  ['daniel@gmail.com',   'freshmart@store.com',       3],
  ['eva@gmail.com',      'freshmart@store.com',       4],
  ['frank@gmail.com',    'freshmart@store.com',       5],

  // Tech Galaxy
  ['alice@gmail.com',    'techgalaxy@store.com',      4],
  ['bob@gmail.com',      'techgalaxy@store.com',      5],
  ['grace@gmail.com',    'techgalaxy@store.com',      4],
  ['henry@gmail.com',    'techgalaxy@store.com',      3],
  ['isabella@gmail.com', 'techgalaxy@store.com',      5],

  // Fashion Forward
  ['carol@gmail.com',    'fashionforward@store.com',  3],
  ['eva@gmail.com',      'fashionforward@store.com',  4],
  ['grace@gmail.com',    'fashionforward@store.com',  5],
  ['isabella@gmail.com', 'fashionforward@store.com',  4],
  ['james@gmail.com',    'fashionforward@store.com',  2],

  // BookNest
  ['alice@gmail.com',    'booknest@store.com',        5],
  ['daniel@gmail.com',   'booknest@store.com',        5],
  ['frank@gmail.com',    'booknest@store.com',        4],
  ['henry@gmail.com',    'booknest@store.com',        5],
  ['james@gmail.com',    'booknest@store.com',        4],

  // Home Comfort
  ['bob@gmail.com',      'homecomfort@store.com',     3],
  ['carol@gmail.com',    'homecomfort@store.com',     4],
  ['eva@gmail.com',      'homecomfort@store.com',     3],
  ['grace@gmail.com',    'homecomfort@store.com',     4],

  // Organic Bliss
  ['alice@gmail.com',    'organicbliss@store.com',    5],
  ['frank@gmail.com',    'organicbliss@store.com',    4],
  ['isabella@gmail.com', 'organicbliss@store.com',    5],
  ['james@gmail.com',    'organicbliss@store.com',    4],

  // Sports Zone
  ['bob@gmail.com',      'sportszone@store.com',      4],
  ['daniel@gmail.com',   'sportszone@store.com',      5],
  ['henry@gmail.com',    'sportszone@store.com',      4],

  // Pet Paradise
  ['carol@gmail.com',    'petparadise@store.com',     4],
  ['eva@gmail.com',      'petparadise@store.com',     5],
  ['grace@gmail.com',    'petparadise@store.com',     3],
  ['james@gmail.com',    'petparadise@store.com',     4],
];

// ─── Seed Function ────────────────────────────────────────────────────────────

async function seed() {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('  🌱 Seeding Dummy Data...');
  console.log('═══════════════════════════════════════════════');
  console.log('');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('✓ Connected to database:', process.env.DB_NAME);
  console.log('');

  // ── Clear existing data (preserve table structure) ──
  console.log('Clearing existing data...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query('TRUNCATE TABLE ratings');
  await conn.query('TRUNCATE TABLE stores');
  await conn.query('TRUNCATE TABLE users');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✓ Tables cleared');
  console.log('');

  // ── Insert Users ──────────────────────────────────
  console.log('Inserting users...');
  const userMap = {}; // email → id

  const allUsers = [...adminUsers, ...storeOwners, ...normalUsers];
  for (const user of allUsers) {
    const hashed = await bcrypt.hash(user.password, 10);
    const [result] = await conn.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [user.name, user.email, hashed, user.address, user.role]
    );
    userMap[user.email] = result.insertId;
  }

  console.log(`✓ ${adminUsers.length} admin users inserted`);
  console.log(`✓ ${storeOwners.length} store owners inserted`);
  console.log(`✓ ${normalUsers.length} normal users inserted`);
  console.log('');

  // ── Insert Stores ─────────────────────────────────
  console.log('Inserting stores...');
  const storeMap = {}; // email → id

  for (const store of stores) {
    const ownerId = store.owner_email ? userMap[store.owner_email] : null;
    const [result] = await conn.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [store.name, store.email, store.address, ownerId]
    );
    storeMap[store.email] = result.insertId;
  }

  console.log(`✓ ${stores.length} stores inserted`);
  console.log('');

  // ── Insert Ratings ────────────────────────────────
  console.log('Inserting ratings...');

  for (const [userEmail, storeEmail, rating] of ratings) {
    const userId = userMap[userEmail];
    const storeId = storeMap[storeEmail];
    await conn.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );
  }

  console.log(`✓ ${ratings.length} ratings inserted`);
  console.log('');

  // ── Summary ───────────────────────────────────────
  console.log('Calculating averages...');
  const [avgRows] = await conn.query(`
    SELECT s.name, ROUND(AVG(r.rating), 2) AS avg_rating, COUNT(r.id) AS total_ratings
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    GROUP BY s.id, s.name
    ORDER BY avg_rating DESC
  `);

  console.log('');
  console.log('Store Rating Summary:');
  console.log('─────────────────────────────────────────────');
  avgRows.forEach((row) => {
    const avgRating = parseFloat(row.avg_rating) || 0;
    const stars = '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating));
    const avg = avgRating > 0 ? avgRating.toFixed(2) : 'N/A';
    const count = row.total_ratings || 0;
    console.log(`  ${stars}  ${avg}  (${count} ratings)  ${row.name}`);
  });

  await conn.end();

  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('  ✅ Seeding completed successfully!');
  console.log('═══════════════════════════════════════════════');
  console.log('');
  console.log('  Test Credentials:');
  console.log('  ─────────────────────────────────────────────');
  console.log('  Admin:       admin@admin.com        / Admin@123');
  console.log('  Admin 2:     sarah.admin@storerate.com / Admin@123');
  console.log('  Owner 1:     michael.owner@gmail.com  / Owner@123');
  console.log('  Owner 2:     emily.owner@gmail.com    / Owner@123');
  console.log('  Owner 3:     david.owner@gmail.com    / Owner@123');
  console.log('  Normal User: alice@gmail.com           / User@1234');
  console.log('  Normal User: bob@gmail.com             / User@1234');
  console.log('  (all normal users use password: User@1234)');
  console.log('');
}

seed().catch((err) => {
  console.error('');
  console.error('═══════════════════════════════════════════════');
  console.error('  ❌ Seeding failed!');
  console.error('═══════════════════════════════════════════════');
  console.error(`  Error: ${err.message}`);
  console.error(`  Code: ${err.code || 'N/A'}`);
  if (err.code === 'ER_BAD_DB_ERROR' || err.code === 'ECONNREFUSED') {
    console.error('');
    console.error('  → Make sure the database is set up first:');
    console.error('    npm run migrate');
  }
  console.error('');
  process.exit(1);
});
