const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function migrate() {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('  📦 Database Migration Starting...');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log('');

  // Connect without specifying DB first to create it if needed
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  console.log('✓ MySQL server connected successfully');
  console.log('');

  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  console.log(`✓ Database '${process.env.DB_NAME}' ensured`);

  await conn.query(`USE \`${process.env.DB_NAME}\``);

  // Helper: create index only if it doesn't already exist
  const ensureIndex = async (table, indexName, columns) => {
    const [rows] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.statistics
       WHERE table_schema = DATABASE()
         AND table_name = ? AND index_name = ?`,
      [table, indexName]
    );
    if (rows[0].cnt === 0) {
      await conn.query(`CREATE INDEX ${indexName} ON ${table}(${columns})`);
    }
  };

  // Users table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(60) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(400) NOT NULL,
      role ENUM('admin', 'user', 'owner') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✓ Table users ensured');

  // Stores table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS stores (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(60) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      address VARCHAR(400) NOT NULL,
      owner_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_store_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✓ Table stores ensured');

  // Index on stores.owner_id — avoids full table scan on owner dashboard query
  await ensureIndex('stores', 'idx_stores_owner_id', 'owner_id');
  console.log('✓ Index on stores.owner_id ensured');

  // Ratings table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      store_id INT NOT NULL,
      rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_user_store (user_id, store_id),
      CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_rating_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✓ Table ratings ensured');

  // Indexes on ratings foreign keys — speeds up JOIN queries on both store and user lookups
  await ensureIndex('ratings', 'idx_ratings_store_id', 'store_id');
  await ensureIndex('ratings', 'idx_ratings_user_id', 'user_id');
  console.log('✓ Indexes on ratings(store_id, user_id) ensured');

  // Seed default admin user
  const [existing] = await conn.query(
    "SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1"
  );
  if (existing.length === 0) {
    const hashed = await bcrypt.hash('Admin@123', 10);
    await conn.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      ['System Administrator', 'admin@admin.com', hashed, 'Admin Headquarters Address', 'admin']
    );
    console.log('✓ Default admin created: admin@admin.com / Admin@123');
  } else {
    console.log('✓ Default admin already exists');
  }

  await conn.end();
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('  ✅ Migration completed successfully!');
  console.log('═══════════════════════════════════════════════');
  console.log('');
}

migrate().catch((err) => {
  console.error('');
  console.error('═══════════════════════════════════════════════');
  console.error('  ❌ Migration failed!');
  console.error('═══════════════════════════════════════════════');
  console.error(`  Error: ${err.message}`);
  console.error(`  Code: ${err.code || 'N/A'}`);
  console.error('');
  if (err.code === 'ECONNREFUSED') {
    console.error('  → MySQL server is not running');
    console.error('  → Start MySQL and try again');
  } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('  → Invalid database credentials');
    console.error('  → Check DB_USER and DB_PASSWORD in .env');
  } else if (err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
    console.error('  → MySQL authentication issue');
    console.error('  → Try: ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'yourpassword\';');
  }
  console.error('');
  console.error('Stack trace:');
  console.error(err.stack);
  console.error('');
  process.exit(1);
});
