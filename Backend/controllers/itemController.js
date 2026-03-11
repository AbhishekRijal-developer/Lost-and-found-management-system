import pool from '../config/database.js';
import { sendReportNotification } from '../services/emailService.js';

export const itemController = {
  // Get all items with filters, search, and pagination
  getAllItems: async (req, res) => {
    try {
      const { type, status, category, location, limit = 50, offset = 0, search } = req.query;
      const connection = await pool.getConnection();
      
      try {
        let query = 'SELECT * FROM items WHERE 1=1';
        const params = [];

        if (type) {
          query += ' AND itemType = ?';
          params.push(type);
        }
        if (status) {
          query += ' AND status = ?';
          params.push(status);
        }
        if (category) {
          query += ' AND category = ?';
          params.push(category);
        }
        if (search) {
          query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
          const searchTerm = `%${search}%`;
          params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await connection.query(query, params);
        
        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM items WHERE 1=1';
        const countParams = [];
        
        if (type) {
          countQuery += ' AND itemType = ?';
          countParams.push(type);
        }
        if (status) {
          countQuery += ' AND status = ?';
          countParams.push(status);
        }
        if (category) {
          countQuery += ' AND category = ?';
          countParams.push(category);
        }
        if (search) {
          countQuery += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
          const searchTerm = `%${search}%`;
          countParams.push(searchTerm, searchTerm, searchTerm);
        }

        const [countRows] = await connection.query(countQuery, countParams);
        const total = countRows[0].total;

        return res.json({
          success: true,
          data: rows,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            pages: Math.ceil(total / parseInt(limit))
          }
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

  // Update item status
  updateItemStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['Active', 'Resolved', 'Archived'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Allowed: Active, Resolved, Archived'
        });
      }

      const connection = await pool.getConnection();
      
      try {
        const [result] = await connection.query('UPDATE items SET status = ?, updatedAt = NOW() WHERE id = ?', [status, id]);
        
        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: 'Item not found'
          });
        }
        
        return res.json({
          success: true,
          message: `Item status updated to ${status}`
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error updating item status',
        error: error.message
      });
    }
  },

  // Get user's items
  getUserItems: async (req, res) => {
    try {
      const userId = req.user.id; // From auth middleware
      const { type, status, page = 1, limit = 10, search = '' } = req.query;
      
      const offset = (page - 1) * limit;
      let query = 'SELECT * FROM items WHERE userId = ?';
      let countQuery = 'SELECT COUNT(*) as total FROM items WHERE userId = ?';
      const params = [userId];

      if (type && ['Lost', 'Found'].includes(type)) {
        query += ' AND itemType = ?';
        countQuery += ' AND itemType = ?';
        params.push(type);
      }

      if (status && ['Active', 'Resolved', 'Archived'].includes(status)) {
        query += ' AND status = ?';
        countQuery += ' AND status = ?';
        params.push(status);
      }

      if (search && search.trim()) {
        query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
        countQuery += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';

      const connection = await pool.getConnection();
      
      try {
        const [countResult] = await connection.query(countQuery, params.slice(0, -2));
        const [items] = await connection.query(query, [...params.slice(0, -2), parseInt(limit), offset]);

        return res.json({
          success: true,
          data: items,
          pagination: {
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(countResult[0].total / limit)
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching user items',
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
