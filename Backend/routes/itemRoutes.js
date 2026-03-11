import express from 'express';
import { itemController } from '../controllers/itemController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Search items (must be before /:id to avoid conflicts)
router.get('/search/query', itemController.searchItems);

// Get user's items (protected) (must be before /:id to avoid conflicts)
router.get('/user/my-items', authenticateToken, itemController.getUserItems);

// Get all items
router.get('/', itemController.getAllItems);

// Get item by ID
router.get('/:id', itemController.getItemById);

// Create new item (protected)
router.post('/', authenticateToken, itemController.createItem);

// Update item (protected)
router.put('/:id', authenticateToken, itemController.updateItem);

// Update item status (protected)
router.patch('/:id/status', authenticateToken, itemController.updateItemStatus);

// Delete item (protected)
router.delete('/:id', authenticateToken, itemController.deleteItem);

export default router;
