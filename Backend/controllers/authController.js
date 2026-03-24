import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import {
  sendLoginNotification,
  sendPasswordResetEmail,
  sendRegistrationOtpEmail
} from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const IIC_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@iic\.edu\.np$/i;

const generateOtpCode = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = (10 ** OTP_LENGTH) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

const hashOtpCode = (otpCode) => crypto.createHash('sha256').update(otpCode).digest('hex');

export const authController = {
  // Register User
  register: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      
      if (!IIC_EMAIL_REGEX.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Email must end with @iic.edu.np'
        });
      }

      const otpCode = generateOtpCode();
      const otpHash = hashOtpCode(otpCode);
      const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
      
      const connection = await pool.getConnection();
      
      try {
        // Check if user exists
        const [existingUser] = await connection.query(
          'SELECT id, isEmailVerified FROM users WHERE email = ?',
          [normalizedEmail]
        );

        if (existingUser.length > 0) {
          const user = existingUser[0];

          if (Boolean(user.isEmailVerified)) {
            return res.status(409).json({
              success: false,
              message: 'Email already registered'
            });
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          await connection.query(
            `UPDATE users
             SET name = ?,
                 password = ?,
                 phone = ?,
                 role = 'User',
                 isEmailVerified = 0,
                 emailVerificationOtp = ?,
                 emailVerificationExpires = ?,
                 updatedAt = NOW()
             WHERE id = ?`,
            [name.trim(), hashedPassword, phone || null, otpHash, otpExpiresAt, user.id]
          );
        } else {
          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Create unverified user and send OTP for email verification.
          await connection.query(
            `INSERT INTO users (name, email, password, phone, role, isEmailVerified, emailVerificationOtp, emailVerificationExpires)
             VALUES (?, ?, ?, ?, 'User', 0, ?, ?)`,
            [name.trim(), normalizedEmail, hashedPassword, phone || null, otpHash, otpExpiresAt]
          );
        }

        const otpSent = await sendRegistrationOtpEmail(normalizedEmail, name.trim(), otpCode);

        if (!otpSent) {
          return res.status(500).json({
            success: false,
            message: 'Unable to send OTP email right now. Please try again.'
          });
        }
        
        return res.status(201).json({
          success: true,
          message: 'Registration started. Enter the OTP sent to your email to verify your account.',
          email: normalizedEmail,
          requiresOtp: true
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

  // Verify registration OTP
  verifyRegistrationOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP are required'
        });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const normalizedOtp = String(otp).trim();

      if (!IIC_EMAIL_REGEX.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Email must end with @iic.edu.np'
        });
      }

      if (!/^\d{6}$/.test(normalizedOtp)) {
        return res.status(400).json({
          success: false,
          message: 'OTP must be a 6-digit code'
        });
      }

      const connection = await pool.getConnection();

      try {
        const [rows] = await connection.query(
          `SELECT id, isEmailVerified, emailVerificationOtp, emailVerificationExpires
           FROM users
           WHERE email = ?`,
          [normalizedEmail]
        );

        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Account not found. Please register first.'
          });
        }

        const user = rows[0];

        if (Boolean(user.isEmailVerified)) {
          return res.json({
            success: true,
            message: 'Email already verified. You can login now.'
          });
        }

        if (!user.emailVerificationOtp || !user.emailVerificationExpires || new Date(user.emailVerificationExpires) < new Date()) {
          return res.status(400).json({
            success: false,
            message: 'OTP expired. Please request a new OTP.'
          });
        }

        const otpHash = hashOtpCode(normalizedOtp);

        if (otpHash !== user.emailVerificationOtp) {
          return res.status(400).json({
            success: false,
            message: 'Invalid OTP. Please check and try again.'
          });
        }

        await connection.query(
          `UPDATE users
           SET isEmailVerified = 1,
               emailVerificationOtp = NULL,
               emailVerificationExpires = NULL,
               updatedAt = NOW()
           WHERE id = ?`,
          [user.id]
        );

        return res.json({
          success: true,
          message: 'Email verified successfully. You can now login with your email and password.'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error verifying OTP',
        error: error.message
      });
    }
  },

  // Resend registration OTP
  resendRegistrationOtp: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const normalizedEmail = String(email).trim().toLowerCase();

      if (!IIC_EMAIL_REGEX.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Email must end with @iic.edu.np'
        });
      }

      const connection = await pool.getConnection();

      try {
        const [rows] = await connection.query(
          'SELECT id, name, isEmailVerified FROM users WHERE email = ?',
          [normalizedEmail]
        );

        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Account not found. Please register first.'
          });
        }

        const user = rows[0];

        if (Boolean(user.isEmailVerified)) {
          return res.status(400).json({
            success: false,
            message: 'Email is already verified. Please login.'
          });
        }

        const otpCode = generateOtpCode();
        const otpHash = hashOtpCode(otpCode);
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        await connection.query(
          `UPDATE users
           SET emailVerificationOtp = ?,
               emailVerificationExpires = ?,
               updatedAt = NOW()
           WHERE id = ?`,
          [otpHash, otpExpiresAt, user.id]
        );

        const otpSent = await sendRegistrationOtpEmail(normalizedEmail, user.name, otpCode);

        if (!otpSent) {
          return res.status(500).json({
            success: false,
            message: 'Unable to send OTP email right now. Please try again.'
          });
        }

        return res.json({
          success: true,
          message: 'A new OTP has been sent to your email.'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error resending OTP',
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

        if (!Boolean(user.isEmailVerified)) {
          return res.status(403).json({
            success: false,
            message: 'Please verify your email with OTP before logging in.'
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
            phone: user.phone,
            bio: user.bio,
            department: user.department,
            batch: user.batch,
            location: user.location,
            profilePicture: user.profilePicture
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
        const [rows] = await connection.query(
          'SELECT id, name, email, phone, role, bio, department, batch, location, profilePicture FROM users WHERE id = ?',
          [userId]
        );
        
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
      const { name, phone, bio, department, batch, location, profilePicture } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      const connection = await pool.getConnection();

      try {
        await connection.query(
          `UPDATE users
           SET name = ?,
               phone = ?,
               bio = ?,
               department = ?,
               batch = ?,
               location = ?,
               profilePicture = ?,
               updatedAt = NOW()
           WHERE id = ?`,
          [
            name.trim(),
            phone || null,
            bio || null,
            department || null,
            batch || null,
            location || null,
            profilePicture || null,
            userId
          ]
        );

        const [rows] = await connection.query(
          'SELECT id, name, email, phone, role, bio, department, batch, location, profilePicture FROM users WHERE id = ?',
          [userId]
        );

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
  },

  // Get current user profile statistics
  getProfileStats: async (req, res) => {
    try {
      const userId = req.user.id;
      const connection = await pool.getConnection();

      try {
        const [rows] = await connection.query(
          `SELECT
             COUNT(*) AS totalReports,
             SUM(CASE WHEN itemType = 'Found' THEN 1 ELSE 0 END) AS itemsFound,
             SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) AS resolvedReports
           FROM items
           WHERE userId = ?`,
          [userId]
        );

        const totalReports = Number(rows[0]?.totalReports || 0);
        const itemsFound = Number(rows[0]?.itemsFound || 0);
        const resolvedReports = Number(rows[0]?.resolvedReports || 0);
        const helpfulRating = totalReports > 0
          ? Math.round((resolvedReports / totalReports) * 100)
          : 0;

        return res.json({
          success: true,
          data: {
            totalReports,
            itemsFound,
            helpfulRating
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching profile stats',
        error: error.message
      });
    }
  }
};
