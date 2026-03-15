import pool from '../config/database.js';

export const ensureContactSchema = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.query(
      `CREATE TABLE IF NOT EXISTS contact_messages (
         id INT PRIMARY KEY AUTO_INCREMENT,
         userId INT NULL,
         name VARCHAR(120) NOT NULL,
         email VARCHAR(150) NOT NULL,
         subject VARCHAR(255) NOT NULL,
         message TEXT NOT NULL,
         status ENUM('Open', 'Addressed') DEFAULT 'Open',
         adminReply TEXT NULL,
         repliedBy INT NULL,
         repliedAt DATETIME NULL,
         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
         FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
         FOREIGN KEY (repliedBy) REFERENCES users(id) ON DELETE SET NULL,
         INDEX idx_status (status),
         INDEX idx_createdAt (createdAt)
       )`
    );

    // Allow chat_messages.itemId to be NULL so admin support replies
    // can be delivered as direct messages without being tied to an item.
    try {
      await connection.query(
        'ALTER TABLE chat_messages MODIFY COLUMN itemId INT NULL DEFAULT NULL'
      );
    } catch (_) {
      // Column is already nullable – safe to ignore.
    }
  } finally {
    connection.release();
  }
};
