import express from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All notification routes require authentication
router.use(authenticateToken);

// Create notification (might be called by backend for automatic notifications)
router.post('/', notificationController.createNotification);

// Get user's notifications (protected)
router.get('/', notificationController.getNotifications);

// Mark all notifications as read (protected)
router.put('/read-all', notificationController.markAllAsRead);

// Mark specific notification as read (protected)
router.put('/:id/read', notificationController.markAsRead);

// Delete notification (protected)
router.delete('/:id', notificationController.deleteNotification);

export default router;
