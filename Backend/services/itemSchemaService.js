import pool from '../config/database.js';

export const ensureItemSchema = async () => {
  const connection = await pool.getConnection();

  try {
    const [columns] = await connection.query("SHOW COLUMNS FROM items LIKE 'imageUrl'");

    if (columns.length === 0) {
      return;
    }

    const imageColumn = columns[0];
    const columnType = String(imageColumn.Type || '').toLowerCase();

    if (columnType !== 'longtext') {
      await connection.query('ALTER TABLE items MODIFY COLUMN imageUrl LONGTEXT NULL');
      console.log('item schema ensured: items.imageUrl converted to LONGTEXT');
    }
  } finally {
    connection.release();
  }
};
