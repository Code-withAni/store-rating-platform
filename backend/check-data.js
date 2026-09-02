require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkData() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log(`  📊 Database: ${process.env.DB_NAME}`);
  console.log('═══════════════════════════════════════════════');

  // ── Counts ──────────────────────────────────────
  const [[counts]] = await conn.query(`
    SELECT
      (SELECT COUNT(*) FROM users)   AS users,
      (SELECT COUNT(*) FROM stores)  AS stores,
      (SELECT COUNT(*) FROM ratings) AS ratings
  `);
  console.log('');
  console.log(`  👥 Users:   ${counts.users}`);
  console.log(`  🏪 Stores:  ${counts.stores}`);
  console.log(`  ⭐ Ratings: ${counts.ratings}`);

  // ── Users by Role ────────────────────────────────
  console.log('');
  console.log('─── Users ──────────────────────────────────────');
  const [users] = await conn.query(
    'SELECT id, name, email, role FROM users ORDER BY role, name'
  );
  users.forEach((u) => {
    const roleIcon = u.role === 'admin' ? '🔑' : u.role === 'owner' ? '🏪' : '👤';
    console.log(`  ${roleIcon} [${u.role.padEnd(5)}] ${u.name.padEnd(30)} ${u.email}`);
  });

  // ── Stores with Ratings ──────────────────────────
  console.log('');
  console.log('─── Stores ─────────────────────────────────────');
  const [stores] = await conn.query(`
    SELECT s.name, s.email,
           ROUND(AVG(r.rating), 2) AS avg_rating,
           COUNT(r.id) AS total_ratings
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    GROUP BY s.id, s.name, s.email
    ORDER BY avg_rating DESC
  `);
  stores.forEach((s) => {
    const avg = s.avg_rating ? parseFloat(s.avg_rating).toFixed(2) : 'N/A';
    const stars = s.avg_rating
      ? '★'.repeat(Math.round(s.avg_rating)) + '☆'.repeat(5 - Math.round(s.avg_rating))
      : '☆☆☆☆☆';
    console.log(`  ${stars} ${avg}  (${s.total_ratings} ratings)  ${s.name}`);
  });

  // ── Ratings Detail ───────────────────────────────
  console.log('');
  console.log('─── Ratings ────────────────────────────────────');
  const [ratings] = await conn.query(`
    SELECT u.name AS user_name, s.name AS store_name, r.rating
    FROM ratings r
    JOIN users u ON u.id = r.user_id
    JOIN stores s ON s.id = r.store_id
    ORDER BY s.name, r.rating DESC
  `);
  ratings.forEach((r) => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    console.log(`  ${stars}  ${r.user_name.padEnd(30)} → ${r.store_name}`);
  });

  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('');

  await conn.end();
}

checkData().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
