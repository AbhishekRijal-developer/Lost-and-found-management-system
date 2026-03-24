import pool from '../config/database.js';

const authColumns = [
  {
    name: 'isEmailVerified',
    ddl: 'ALTER TABLE users ADD COLUMN isEmailVerified BOOLEAN NOT NULL DEFAULT FALSE AFTER password'
  },
  {
    name: 'emailVerificationOtp',
    ddl: 'ALTER TABLE users ADD COLUMN emailVerificationOtp VARCHAR(64) NULL AFTER isEmailVerified'
  },
  {
    name: 'emailVerificationExpires',
    ddl: 'ALTER TABLE users ADD COLUMN emailVerificationExpires DATETIME NULL AFTER emailVerificationOtp'
  }
];

const authIndexes = [
  {
    name: 'idx_emailVerificationOtp',
    ddl: 'CREATE INDEX idx_emailVerificationOtp ON users (emailVerificationOtp)'
  },
  {
    name: 'idx_isEmailVerified',
    ddl: 'CREATE INDEX idx_isEmailVerified ON users (isEmailVerified)'
  }
];

export const ensureAuthSchema = async () => {
  const connection = await pool.getConnection();

  try {
    for (const column of authColumns) {
      const [rows] = await connection.query('SHOW COLUMNS FROM users LIKE ?', [column.name]);

      if (rows.length === 0) {
        await connection.query(column.ddl);
      }
    }

    for (const index of authIndexes) {
      const [rows] = await connection.query('SHOW INDEX FROM users WHERE Key_name = ?', [index.name]);

      if (rows.length === 0) {
        await connection.query(index.ddl);
      }
    }

    // Keep pre-existing users working after enabling email verification.
    await connection.query(
      `UPDATE users
       SET isEmailVerified = 1
       WHERE isEmailVerified = 0
         AND emailVerificationOtp IS NULL
         AND emailVerificationExpires IS NULL`
    );
  } finally {
    connection.release();
  }
};
