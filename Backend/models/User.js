import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create(userData) {
    const { name, email, password, phone, location } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = 'INSERT INTO users (name, email, password, phone, location) VALUES (?, ?, ?, ?, ?)';
    return pool.query(query, [name, email, hashedPassword, phone, location]);
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, userData) {
    const { name, phone, location } = userData;
    const query = 'UPDATE users SET name = ?, phone = ?, location = ? WHERE id = ?';
    return pool.query(query, [name, phone, location, id]);
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default User;