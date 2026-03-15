import express from 'express';
import { contactController } from '../controllers/contactController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Users send contact messages.
router.post('/', authenticateToken, contactController.submitMessage);

// Admin message management.
router.get('/', authenticateToken, requireAdmin, contactController.getAllMessages);
router.patch('/:id/reply', authenticateToken, requireAdmin, contactController.replyToMessage);
router.patch('/:id/status', authenticateToken, requireAdmin, contactController.updateMessageStatus);

export default router;
