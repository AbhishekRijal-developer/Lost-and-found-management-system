import pool from '../config/database.js';

export const chatController = {
  // Send message
  sendMessage: async (req, res) => {
    try {
      const { itemId, receiverId, message } = req.body;
      const senderId = req.user.id;

      if (!itemId || !receiverId || !message || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'itemId, receiverId, and message are required'
        });
      }

      const connection = await pool.getConnection();

      try {
        // Verify item exists
        const [itemCheck] = await connection.query('SELECT id FROM items WHERE id = ?', [itemId]);
        if (itemCheck.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Item not found'
          });
        }

        // Verify receiver exists
        const [receiverCheck] = await connection.query('SELECT id FROM users WHERE id = ?', [receiverId]);
        if (receiverCheck.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Receiver not found'
          });
        }

        // Insert message
        const [result] = await connection.query(
          'INSERT INTO chat_messages (itemId, senderId, receiverId, message, isRead, createdAt) VALUES (?, ?, ?, ?, 0, NOW())',
          [itemId, senderId, receiverId, message.trim()]
        );

        return res.status(201).json({
          success: true,
          message: 'Message sent successfully',
          data: {
            id: result.insertId,
            itemId,
            senderId,
            receiverId,
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
        message: 'Error sending message',
        error: error.message
      });
    }
  },

  // Get messages for a specific conversation (between two users about an item)
  getMessages: async (req, res) => {
    try {
      const { itemId, otherUserId, page = 1, limit = 20 } = req.query;
      const userId = req.user.id;

      if (!itemId || !otherUserId) {
        return res.status(400).json({
          success: false,
          message: 'itemId and otherUserId are required'
        });
      }

      const offset = (page - 1) * limit;

      const connection = await pool.getConnection();

      try {
        // Get messages between these two users about this item
        const query = `
          SELECT cm.*, 
                 sender.name as senderName, sender.email as senderEmail,
                 receiver.name as receiverName, receiver.email as receiverEmail
          FROM chat_messages cm
          JOIN users sender ON cm.senderId = sender.id
          JOIN users receiver ON cm.receiverId = receiver.id
          WHERE cm.itemId = ? 
          AND ((cm.senderId = ? AND cm.receiverId = ?) OR (cm.senderId = ? AND cm.receiverId = ?))
          ORDER BY cm.createdAt ASC
          LIMIT ? OFFSET ?
        `;

        const [messages] = await connection.query(query, [
          itemId,
          userId,
          otherUserId,
          otherUserId,
          userId,
          parseInt(limit),
          offset
        ]);

        // Get total count
        const countQuery = `
          SELECT COUNT(*) as total FROM chat_messages
          WHERE itemId = ? 
          AND ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
        `;
        const [countResult] = await connection.query(countQuery, [
          itemId,
          userId,
          otherUserId,
          otherUserId,
          userId
        ]);

        return res.json({
          success: true,
          data: messages,
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
        message: 'Error fetching messages',
        error: error.message
      });
    }
  },

  // Get all conversations for current user
  getConversations: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const connection = await pool.getConnection();

      try {
        // Get unique conversations with latest message
        const query = `
          SELECT DISTINCT 
                 CASE 
                   WHEN cm.senderId = ? THEN cm.receiverId 
                   ELSE cm.senderId 
                 END as otherUserId,
                 u.name, u.email, u.phone,
                 i.id as itemId, i.title as itemTitle, i.itemType,
                 cm.message as lastMessage,
                 cm.createdAt as lastMessageTime,
                 SUM(CASE WHEN cm.receiverId = ? AND cm.isRead = 0 THEN 1 ELSE 0 END) as unreadCount
          FROM chat_messages cm
          JOIN users u ON (CASE 
                            WHEN cm.senderId = ? THEN cm.receiverId 
                            ELSE cm.senderId 
                          END) = u.id
          JOIN items i ON cm.itemId = i.id
          WHERE cm.senderId = ? OR cm.receiverId = ?
          GROUP BY otherUserId, cm.itemId
          ORDER BY cm.createdAt DESC
          LIMIT ? OFFSET ?
        `;

        const [conversations] = await connection.query(query, [
          userId,
          userId,
          userId,
          userId,
          userId,
          parseInt(limit),
          offset
        ]);

        // Get total count
        const countQuery = `
          SELECT COUNT(DISTINCT 
                 CASE 
                   WHEN senderId = ? THEN receiverId 
                   ELSE senderId 
                 END,
                 itemId) as total
          FROM chat_messages
          WHERE senderId = ? OR receiverId = ?
        `;
        const [countResult] = await connection.query(countQuery, [userId, userId, userId]);

        return res.json({
          success: true,
          data: conversations,
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
        message: 'Error fetching conversations',
        error: error.message
      });
    }
  },

  // Mark messages as read
  markAsRead: async (req, res) => {
    try {
      const { itemId, otherUserId } = req.body;
      const userId = req.user.id;

      if (!itemId || !otherUserId) {
        return res.status(400).json({
          success: false,
          message: 'itemId and otherUserId are required'
        });
      }

      const connection = await pool.getConnection();

      try {
        const [result] = await connection.query(
          `UPDATE chat_messages 
           SET isRead = 1 
           WHERE itemId = ? AND senderId = ? AND receiverId = ?`,
          [itemId, otherUserId, userId]
        );

        return res.json({
          success: true,
          message: 'Messages marked as read',
          markedCount: result.affectedRows
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error marking messages as read',
        error: error.message
      });
    }
  }
};
