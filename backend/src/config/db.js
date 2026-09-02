const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
pool.getConnection()
  .then((connection) => {
    console.log('✓ MySQL database connected successfully');
    console.log(`  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`  Database: ${process.env.DB_NAME}`);
    connection.release();
  })
  .catch((err) => {
    console.error('✗ MySQL connection failed:');
    console.error(`  Error: ${err.message}`);
    console.error(`  Code: ${err.code}`);
    if (err.code === 'ECONNREFUSED') {
      console.error('  → Make sure MySQL server is running');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  → Check your database credentials in .env file');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('  → Database does not exist. Run: node src/config/migrate.js');
    }
    console.error('');
  });

module.exports = pool;
