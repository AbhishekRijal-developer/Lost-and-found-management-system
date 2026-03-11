import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lostandfound',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully!');
    connection.release();
  } catch (err) {
    console.error('❌ Error connecting to the database:', err.message);
  }
})();

export default pool;
