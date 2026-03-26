import pool from '../config/database.js';

class Item {
  static async create(itemData) {
    const { userId, title, description, category, location, itemDate, image, status, type } = itemData;
    
    const query = `INSERT INTO items (user_id, title, description, category, location, item_date, image, status, type, created_at) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
    
    return pool.query(query, [userId, title, description, category, location, itemDate, image, status, type]);
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM items WHERE 1=1';
    const params = [];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC LIMIT 50';
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC';
    const [rows] = await pool.query(query, [userId]);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM items WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, itemData) {
    const { title, description, category, location, status, priority } = itemData;
    const query = 'UPDATE items SET title = ?, description = ?, category = ?, location = ?, status = ?, priority = ? WHERE id = ?';
    return pool.query(query, [title, description, category, location, status, priority || 'Medium', id]);
  }

  static async delete(id) {
    const query = 'DELETE FROM items WHERE id = ?';
    return pool.query(query, [id]);
  }
}

export default Item;