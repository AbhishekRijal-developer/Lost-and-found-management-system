import pool from '../config/database.js';
import { sendReportNotification } from '../services/emailService.js';

export const itemController = {
  // Get all items (both lost and found)
  getAllItems: async (req, res) => {
    try {
      const connection = await pool.getConnection();
      
      try {
        const [rows] = await connection.query('SELECT * FROM items ORDER BY createdAt DESC');
        
        return res.json({
          success: true,
          data: rows
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching items',
        error: error.message
      });
    }
  },

  // Get item by ID
  getItemById: async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await pool.getConnection();
      
      try {
        const [rows] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        
        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Item not found'
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
      return res.status(500).json({
        success: false,
        message: 'Error fetching item',
        error: error.message
      });
    }
  },

  // Create new item
  createItem: async (req, res) => {
    try {
      const { userId, title, description, category, itemType, location, contactPhone, contactEmail } = req.body;
      
      if (!title || !description || !itemType) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
      
      const connection = await pool.getConnection();
      
      try {
        const query = 'INSERT INTO items (userId, title, description, category, itemType, location, contactPhone, contactEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [userId, title, description, category || null, itemType, location || null, contactPhone || null, contactEmail || null]);
        
        // Send email notification (don't wait for it)
        setTimeout(() => {
          sendReportNotification(contactEmail || 'notspecified', title, itemType).catch(err => {
            console.error('Email notification failed:', err);
          });
        }, 100);
        
        return res.status(201).json({
          success: true,
          message: 'Item created successfully',
          data: { id: result.insertId }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error creating item',
        error: error.message
      });
    }
  },

  // Update item
  updateItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, category, status, location, contactPhone } = req.body;
      
      const connection = await pool.getConnection();
      
      try {
        const query = 'UPDATE items SET title = ?, description = ?, category = ?, status = ?, location = ?, contactPhone = ?, updatedAt = NOW() WHERE id = ?';
        await connection.query(query, [title, description, category, status, location, contactPhone, id]);
        
        return res.json({
          success: true,
          message: 'Item updated successfully'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error updating item',
        error: error.message
      });
    }
  },

  // Delete item
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      
      const connection = await pool.getConnection();
      
      try {
        await connection.query('DELETE FROM items WHERE id = ?', [id]);
        
        return res.json({
          success: true,
          message: 'Item deleted successfully'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error deleting item',
        error: error.message
      });
    }
  },

  // Get user's items
  getMyItems: async (req, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const connection = await pool.getConnection();
      
      try {
        const [rows] = await connection.query('SELECT * FROM items WHERE userId = ? ORDER BY createdAt DESC', [userId]);
        
        return res.json({
          success: true,
          data: rows
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching your items',
        error: error.message
      });
    }
  },

  // Search items
  searchItems: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query required'
        });
      }
      
      const connection = await pool.getConnection();
      
      try {
        const searchTerm = `%${q}%`;
        const [rows] = await connection.query(
          'SELECT * FROM items WHERE title LIKE ? OR description LIKE ? OR location LIKE ? ORDER BY createdAt DESC',
          [searchTerm, searchTerm, searchTerm]
        );
        
        return res.json({
          success: true,
          data: rows
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error searching items',
        error: error.message
      });
    }
  }
};
