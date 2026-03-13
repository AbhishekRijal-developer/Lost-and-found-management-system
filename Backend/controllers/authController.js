import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { sendLoginNotification, sendPasswordResetEmail } from '../services/emailService.js';

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
  },

  // Request password reset
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const connection = await pool.getConnection();

      try {
        const [rows] = await connection.query(
          'SELECT id, name, email FROM users WHERE email = ?',
          [email]
        );

        // Always return success-style message to prevent email enumeration.
        if (rows.length === 0) {
          return res.json({
            success: true,
            message: 'If an account exists with this email, a reset link has been sent.'
          });
        }

        const user = rows[0];
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await connection.query(
          'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
          [hashedToken, expiresAt, user.id]
        );

        const requestOrigin = req.get('origin');
        const frontendBaseUrl = (
          requestOrigin && requestOrigin.startsWith('http')
            ? requestOrigin
            : (process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:5173')
        ).replace(/\/+$/, '');
        const resetUrl = `${frontendBaseUrl}/reset-password/${rawToken}`;
        const sent = await sendPasswordResetEmail(user.email, user.name, resetUrl);

        if (!sent) {
          await connection.query(
            'UPDATE users SET resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
            [user.id]
          );

          return res.status(500).json({
            success: false,
            message: 'Unable to send reset email right now. Please try again later.'
          });
        }

        return res.json({
          success: true,
          message: 'If an account exists with this email, a reset link has been sent.'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error processing forgot password request',
        error: error.message
      });
    }
  },

  // Reset password using token
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Token and new password are required'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const connection = await pool.getConnection();

      try {
        const [rows] = await connection.query(
          `SELECT id
           FROM users
           WHERE resetPasswordToken = ?
             AND resetPasswordExpires IS NOT NULL
             AND resetPasswordExpires > NOW()`,
          [hashedToken]
        );

        if (rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset link'
          });
        }

        const userId = rows[0].id;
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
          `UPDATE users
           SET password = ?,
               resetPasswordToken = NULL,
               resetPasswordExpires = NULL
           WHERE id = ?`,
          [hashedPassword, userId]
        );

        return res.json({
          success: true,
          message: 'Password reset successful. You can now login with your new password.'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error resetting password',
        error: error.message
      });
    }
  },

  // Update current user profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, phone } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      const connection = await pool.getConnection();

      try {
        await connection.query(
          'UPDATE users SET name = ?, phone = ?, updatedAt = NOW() WHERE id = ?',
          [name.trim(), phone || null, userId]
        );

        const [rows] = await connection.query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [userId]);

        return res.json({
          success: true,
          message: 'Profile updated successfully',
          data: rows[0]
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error updating profile',
        error: error.message
      });
    }
  }
};
