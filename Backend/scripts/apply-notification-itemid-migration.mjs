import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const databaseName = process.env.DB_NAME || 'lostandfound';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: databaseName
});

try {
  const [columns] = await connection.query("SHOW COLUMNS FROM notifications LIKE 'itemId'");

  if (columns.length === 0) {
    console.log('notifications-itemId-missing');
    process.exit(1);
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
    console.log('notification-itemId-migration-not-needed');
  } else {
    await connection.beginTransaction();

    if (currentConstraint) {
      await connection.query(`ALTER TABLE notifications DROP FOREIGN KEY ${currentConstraint.CONSTRAINT_NAME}`);
      console.log('dropped-notification-item-foreign-key');
    }

    if (needsNullable) {
      await connection.query('ALTER TABLE notifications MODIFY COLUMN itemId INT NULL');
      console.log('notification-itemId-now-nullable');
    }

    await connection.query(
      'ALTER TABLE notifications ADD CONSTRAINT fk_notifications_item_id FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE SET NULL'
    );
    console.log('notification-item-foreign-key-updated');

    await connection.commit();
  }
} catch (error) {
  try {
    await connection.rollback();
  } catch {
    // Ignore rollback errors when no transaction is active.
  }

  console.error('notification-itemId-migration-failed', error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}