import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', authController.register);
router.post('/verify-registration-otp', authController.verifyRegistrationOtp);
router.post('/resend-registration-otp', authController.resendRegistrationOtp);

// Login
router.post('/login', authController.login);

// Forgot/reset password
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Get current user (protected route)
router.get('/me', authenticateToken, authController.getCurrentUser);
router.put('/me', authenticateToken, authController.updateProfile);
router.get('/me/stats', authenticateToken, authController.getProfileStats);

export default router;
