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
        const [receiverCheck] = await connection.query('SELECT id, name FROM users WHERE id = ?', [receiverId]);
        if (receiverCheck.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Receiver not found'
          });
        }

        // Fetch sender name for notification text
        const [senderRows] = await connection.query('SELECT name FROM users WHERE id = ?', [senderId]);
        const senderName = senderRows[0]?.name || 'Someone';

        // Insert message
        const [result] = await connection.query(
          'INSERT INTO chat_messages (itemId, senderId, receiverId, message, isRead, createdAt) VALUES (?, ?, ?, ?, 0, NOW())',
          [itemId, senderId, receiverId, message.trim()]
        );

        // Notify the receiver
        await connection.query(
          'INSERT INTO notifications (userId, itemId, type, message, isRead, createdAt) VALUES (?, ?, ?, ?, 0, NOW())',
          [receiverId, itemId || null, 'message', `New message from ${senderName}`]
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

      // itemId may be absent or the string 'null' for admin-support threads
      const isSupport = !itemId || itemId === 'null';
      const parsedItemId = isSupport ? null : itemId;

      if (!otherUserId) {
        return res.status(400).json({
          success: false,
          message: 'otherUserId is required'
        });
      }

      const offset = (page - 1) * limit;

      const connection = await pool.getConnection();

      try {
        const userFilter = '((cm.senderId = ? AND cm.receiverId = ?) OR (cm.senderId = ? AND cm.receiverId = ?))';
        const baseSelect = `
          SELECT cm.*,
                 sender.name as senderName, sender.email as senderEmail,
                 receiver.name as receiverName, receiver.email as receiverEmail
          FROM chat_messages cm
          JOIN users sender ON cm.senderId = sender.id
          JOIN users receiver ON cm.receiverId = receiver.id
        `;

        let query, countQuery, queryParams, countParams;
        if (isSupport) {
          query = baseSelect + ` WHERE cm.itemId IS NULL AND ${userFilter} ORDER BY cm.createdAt ASC LIMIT ? OFFSET ?`;
          queryParams = [userId, otherUserId, otherUserId, userId, parseInt(limit), offset];
          countQuery = `SELECT COUNT(*) as total FROM chat_messages WHERE itemId IS NULL AND ${userFilter.replace(/cm\./g, '')}`;
          countParams = [userId, otherUserId, otherUserId, userId];
        } else {
          query = baseSelect + ` WHERE cm.itemId = ? AND ${userFilter} ORDER BY cm.createdAt ASC LIMIT ? OFFSET ?`;
          queryParams = [parsedItemId, userId, otherUserId, otherUserId, userId, parseInt(limit), offset];
          countQuery = `SELECT COUNT(*) as total FROM chat_messages WHERE itemId = ? AND ${userFilter.replace(/cm\./g, '')}`;
          countParams = [parsedItemId, userId, otherUserId, otherUserId, userId];
        }

        const [messages] = await connection.query(query, queryParams);
        const [countResult] = await connection.query(countQuery, countParams);

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
      const parsedPage = parseInt(page, 10) || 1;
      const parsedLimit = parseInt(limit, 10) || 10;
      const offset = (parsedPage - 1) * parsedLimit;

      const connection = await pool.getConnection();

      try {
        const query = `
          SELECT
            c.otherUserId,
            u.name,
            u.email,
            u.phone,
            c.itemId,
            COALESCE(i.title, 'Admin Support') as itemTitle,
            COALESCE(i.itemType, 'Support') as itemType,
            lm.message as lastMessage,
            lm.createdAt as lastMessageTime,
            COALESCE(uc.unreadCount, 0) as unreadCount
          FROM (
            SELECT
              x.itemId,
              x.otherUserId,
              MAX(x.id) as lastMessageId
            FROM (
              SELECT
                cm.id,
                cm.itemId,
                CASE
                  WHEN cm.senderId = ? THEN cm.receiverId
                  ELSE cm.senderId
                END as otherUserId
              FROM chat_messages cm
              WHERE cm.senderId = ? OR cm.receiverId = ?
            ) x
            GROUP BY x.itemId, x.otherUserId
            ORDER BY MAX(x.id) DESC
            LIMIT ? OFFSET ?
          ) c
          JOIN chat_messages lm ON lm.id = c.lastMessageId
          JOIN users u ON u.id = c.otherUserId
          LEFT JOIN items i ON i.id = c.itemId
          LEFT JOIN (
            SELECT
              itemId,
              senderId,
              COUNT(*) as unreadCount
            FROM chat_messages
            WHERE receiverId = ? AND isRead = 0
            GROUP BY itemId, senderId
          ) uc ON uc.itemId <=> c.itemId AND uc.senderId = c.otherUserId
          ORDER BY lm.id DESC
        `;

        const [conversations] = await connection.query(query, [
          userId,
          userId,
          userId,
          parsedLimit,
          offset,
          userId
        ]);

        // Get total count
        const countQuery = `
          SELECT COUNT(*) as total
          FROM (
            SELECT
              itemId,
              CASE
                WHEN senderId = ? THEN receiverId
                ELSE senderId
              END as otherUserId
            FROM chat_messages
            WHERE senderId = ? OR receiverId = ?
            GROUP BY itemId, otherUserId
          ) c
        `;
        const [countResult] = await connection.query(countQuery, [userId, userId, userId]);

        return res.json({
          success: true,
          data: conversations,
          pagination: {
            total: countResult[0].total,
            page: parsedPage,
            limit: parsedLimit,
            pages: Math.ceil(countResult[0].total / parsedLimit)
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
      const isSupport = itemId === null || itemId === undefined;

      if (!otherUserId) {
        return res.status(400).json({
          success: false,
          message: 'otherUserId is required'
        });
      }

      const connection = await pool.getConnection();

      try {
        let result;
        if (isSupport) {
          [result] = await connection.query(
            'UPDATE chat_messages SET isRead = 1 WHERE itemId IS NULL AND senderId = ? AND receiverId = ?',
            [otherUserId, userId]
          );
        } else {
          [result] = await connection.query(
            'UPDATE chat_messages SET isRead = 1 WHERE itemId = ? AND senderId = ? AND receiverId = ?',
            [itemId, otherUserId, userId]
          );
        }

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
