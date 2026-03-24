import pool from '../config/database.js';

const profileColumns = [
  {
    name: 'profilePicture',
    ddl: 'ALTER TABLE users ADD COLUMN profilePicture LONGTEXT NULL AFTER phone'
  },
  {
    name: 'bio',
    ddl: 'ALTER TABLE users ADD COLUMN bio TEXT NULL AFTER profilePicture'
  },
  {
    name: 'department',
    ddl: 'ALTER TABLE users ADD COLUMN department VARCHAR(120) NULL AFTER bio'
  },
  {
    name: 'batch',
    ddl: 'ALTER TABLE users ADD COLUMN batch VARCHAR(60) NULL AFTER department'
  },
  {
    name: 'location',
    ddl: 'ALTER TABLE users ADD COLUMN location VARCHAR(255) NULL AFTER batch'
  }
];

export const ensureUserProfileSchema = async () => {
  const connection = await pool.getConnection();

  try {
    for (const column of profileColumns) {
      const [rows] = await connection.query(`SHOW COLUMNS FROM users LIKE ?`, [column.name]);

      if (rows.length === 0) {
        await connection.query(column.ddl);
      }
    }
  } finally {
    connection.release();
  }
};
