import pool from '../config/database.js';

export const ensureNotificationSchema = async () => {
  const connection = await pool.getConnection();

  try {
    const databaseName = process.env.DB_NAME || 'lostandfound';

    const [columns] = await connection.query("SHOW COLUMNS FROM notifications LIKE 'itemId'");

    if (columns.length === 0) {
      console.warn('notifications.itemId column was not found; skipping notification schema update');
      return;
    }

    const [constraints] = await connection.query(
      `SELECT rc.CONSTRAINT_NAME, rc.DELETE_RULE
       FROM information_schema.REFERENTIAL_CONSTRAINTS rc
       JOIN information_schema.KEY_COLUMN_USAGE kcu
         ON rc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
        AND rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
       WHERE rc.CONSTRAINT_SCHEMA = ?
         AND rc.TABLE_NAME = 'notifications'
         AND kcu.COLUMN_NAME = 'itemId'
         AND kcu.REFERENCED_TABLE_NAME = 'items'`,
      [databaseName]
    );

    const currentConstraint = constraints[0];
    const itemIdColumn = columns[0];
    const needsNullable = itemIdColumn.Null !== 'YES';
    const needsDeleteRule = !currentConstraint || currentConstraint.DELETE_RULE !== 'SET NULL';

    if (!needsNullable && !needsDeleteRule) {
      return;
    }

    await connection.beginTransaction();

    if (currentConstraint) {
      await connection.query(`ALTER TABLE notifications DROP FOREIGN KEY ${currentConstraint.CONSTRAINT_NAME}`);
    }

    if (needsNullable) {
      await connection.query('ALTER TABLE notifications MODIFY COLUMN itemId INT NULL');
    }

    await connection.query(
      'ALTER TABLE notifications ADD CONSTRAINT fk_notifications_item_id FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE SET NULL'
    );

    await connection.commit();
    console.log('notification schema ensured');
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // Ignore rollback errors when there is no active transaction.
    }

    console.error('failed to ensure notification schema:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};