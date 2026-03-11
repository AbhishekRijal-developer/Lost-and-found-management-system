import express from 'express';
import { chatController } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All chat routes require authentication
router.use(authenticateToken);

// Send message (protected)
router.post('/send', chatController.sendMessage);

// Get messages for a conversation (protected)
router.get('/messages', chatController.getMessages);

// Get conversations for current user (protected)
router.get('/conversations', chatController.getConversations);

// Mark messages as read (protected)
router.put('/read', chatController.markAsRead);

export default router;
