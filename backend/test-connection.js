require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('  🔍 Testing MySQL Connection...');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`  User: ${process.env.DB_USER}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log('');

  try {
    // Test 1: Connect to MySQL server (without database)
    console.log('Test 1: Connecting to MySQL server...');
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    console.log('✓ MySQL server is accessible');

    // Test 2: Check if database exists
    console.log('');
    console.log('Test 2: Checking if database exists...');
    const [databases] = await conn.query(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [process.env.DB_NAME]
    );
    
    if (databases.length > 0) {
      console.log(`✓ Database '${process.env.DB_NAME}' exists`);
      
      // Test 3: Connect to the database
      console.log('');
      console.log('Test 3: Connecting to database...');
      await conn.query(`USE \`${process.env.DB_NAME}\``);
      console.log(`✓ Successfully connected to '${process.env.DB_NAME}'`);
      
      // Test 4: Check tables
      console.log('');
      console.log('Test 4: Checking tables...');
      const [tables] = await conn.query('SHOW TABLES');
      if (tables.length > 0) {
        console.log(`✓ Found ${tables.length} tables:`);
        tables.forEach((table) => {
          console.log(`  - ${Object.values(table)[0]}`);
        });
      } else {
        console.log('⚠ Database exists but no tables found');
        console.log('  Run: npm run migrate');
      }
    } else {
      console.log(`⚠ Database '${process.env.DB_NAME}' does not exist`);
      console.log('  Run: npm run migrate');
    }

    await conn.end();

    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('  ✅ Connection test completed!');
    console.log('═══════════════════════════════════════════════');
    console.log('');

  } catch (err) {
    console.error('');
    console.error('═══════════════════════════════════════════════');
    console.error('  ❌ Connection test failed!');
    console.error('═══════════════════════════════════════════════');
    console.error(`  Error: ${err.message}`);
    console.error(`  Code: ${err.code || 'N/A'}`);
    console.error('');

    if (err.code === 'ECONNREFUSED') {
      console.error('  Diagnosis: MySQL server is not running');
      console.error('');
      console.error('  Solutions:');
      console.error('  1. Start MySQL server');
      console.error('  2. Check if MySQL is installed');
      console.error('  3. Verify the port (default: 3306)');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  Diagnosis: Invalid credentials');
      console.error('');
      console.error('  Solutions:');
      console.error('  1. Check DB_USER in .env file');
      console.error('  2. Check DB_PASSWORD in .env file');
      console.error('  3. Verify user has proper permissions');
    } else if (err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
      console.error('  Diagnosis: MySQL authentication mode issue');
      console.error('');
      console.error('  Solution: Run this in MySQL:');
      console.error(`  ALTER USER '${process.env.DB_USER}'@'localhost'`);
      console.error(`  IDENTIFIED WITH mysql_native_password BY 'yourpassword';`);
    } else if (err.code === 'ENOTFOUND') {
      console.error('  Diagnosis: Cannot resolve hostname');
      console.error('');
      console.error('  Solutions:');
      console.error('  1. Check DB_HOST in .env file');
      console.error('  2. Use "localhost" or "127.0.0.1"');
    }

    console.error('');
    process.exit(1);
  }
}

testConnection();
