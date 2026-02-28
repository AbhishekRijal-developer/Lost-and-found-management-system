import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { sendLoginNotification } from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const authController = {
  // Register User
  register: async (req, res) => {
    try {
      const { name, email, password, phone, role = 'User' } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
      
      if (!email.endsWith('@iic.edu.np')) {
        return res.status(400).json({
          success: false,
          message: 'Email must end with @iic.edu.np'
        });
      }
      
      const connection = await pool.getConnection();
      
      try {
        // Check if user exists
        const [existingUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'Email already registered'
          });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const [result] = await connection.query(
          'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
          [name, email, hashedPassword, phone || null, role]
        );
        
        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          userId: result.insertId
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error.message
      });
    }
  },

  // Login User
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password required'
        });
      }
      
      const connection = await pool.getConnection();
      
      try {
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
        
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        // Send login notification email (don't wait for it)
        setTimeout(() => {
          sendLoginNotification(user.email, user.name).catch(err => {
            console.error('Email notification failed:', err);
          });
        }, 100);
        
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error logging in',
        error: error.message
      });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const connection = await pool.getConnection();
      
      try {
        const [rows] = await connection.query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [userId]);
        
        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
        
        return res.json({
          success: true,
          data: rows[0]
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: error.message
      });
    }
  }
};
