import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lostandfound'
});

try {
  const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'resetPasswordToken'");

  if (columns.length === 0) {
    await connection.query(`
      ALTER TABLE users
      ADD COLUMN resetPasswordToken VARCHAR(64) DEFAULT NULL,
      ADD COLUMN resetPasswordExpires DATETIME DEFAULT NULL
    `);
    console.log('added-reset-columns');
  } else {
    console.log('reset-columns-exist');
  }

  const [indexes] = await connection.query("SHOW INDEX FROM users WHERE Key_name = 'idx_resetPasswordToken'");
  if (indexes.length === 0) {
    await connection.query('CREATE INDEX idx_resetPasswordToken ON users (resetPasswordToken)');
    console.log('added-reset-index');
  } else {
    console.log('reset-index-exists');
  }
} finally {
  await connection.end();
}
