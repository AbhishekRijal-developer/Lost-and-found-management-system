import pool from '../config/database.js';

const ALLOWED_NOTIFICATION_TYPES = ['item_match', 'item_found', 'item_claimed', 'message', 'report_deleted'];

export const notificationController = {
  // Create notification
  createNotification: async (req, res) => {
    try {
      const { userId, itemId, type, message } = req.body;

      if (!userId || !type || !message) {
        return res.status(400).json({
          success: false,
          message: 'userId, type, and message are required'
        });
      }

      if (!ALLOWED_NOTIFICATION_TYPES.includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification type'
        });
      }

      const connection = await pool.getConnection();

      try {
        const [result] = await connection.query(
          'INSERT INTO notifications (userId, itemId, type, message, isRead, createdAt) VALUES (?, ?, ?, ?, 0, NOW())',
          [userId, itemId || null, type, message]
        );

        return res.status(201).json({
          success: true,
          message: 'Notification created',
          data: {
            id: result.insertId,
            userId,
            itemId: itemId || null,
            type,
            message,
            isRead: 0,
            createdAt: new Date()
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error creating notification',
        error: error.message
      });
    }
  },

  // Get user's notifications
  getNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, unreadOnly = false } = req.query;
      const offset = (page - 1) * limit;

      const connection = await pool.getConnection();

      try {
        let query = `
          SELECT n.*, 
                 i.title as itemTitle, i.itemType,
                 u.name as creatorName
          FROM notifications n
          LEFT JOIN items i ON n.itemId = i.id
          LEFT JOIN users u ON i.userId = u.id
          WHERE n.userId = ?
        `;

        const params = [userId];

        if (unreadOnly === 'true' || unreadOnly === true) {
          query += ' AND n.isRead = 0';
        }

        query += ' ORDER BY n.createdAt DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        // Get notifications
        const [notifications] = await connection.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM notifications WHERE userId = ?';
        const countParams = [userId];

        if (unreadOnly === 'true' || unreadOnly === true) {
          countQuery += ' AND isRead = 0';
        }

        const [countResult] = await connection.query(countQuery, countParams);

        const [unreadCountResult] = await connection.query(
          'SELECT COUNT(*) as total FROM notifications WHERE userId = ? AND isRead = 0',
          [userId]
        );

        return res.json({
          success: true,
          data: notifications,
          unreadCount: unreadCountResult[0].total,
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
        message: 'Error fetching notifications',
        error: error.message
      });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const connection = await pool.getConnection();

      try {
        const [result] = await connection.query(
          'UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?',
          [id, userId]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: 'Notification not found'
          });
        }

        return res.json({
          success: true,
          message: 'Notification marked as read'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error marking notification as read',
        error: error.message
      });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      const userId = req.user.id;

      const connection = await pool.getConnection();

      try {
        const [result] = await connection.query(
          'UPDATE notifications SET isRead = 1 WHERE userId = ? AND isRead = 0',
          [userId]
        );

        return res.json({
          success: true,
          message: 'All notifications marked as read',
          markedCount: result.affectedRows
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error marking notifications as read',
        error: error.message
      });
    }
  },

  // Delete notification
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const connection = await pool.getConnection();

      try {
        const [result] = await connection.query(
          'DELETE FROM notifications WHERE id = ? AND userId = ?',
          [id, userId]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: 'Notification not found'
          });
        }

        return res.json({
          success: true,
          message: 'Notification deleted'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error deleting notification',
        error: error.message
      });
    }
  }
};
