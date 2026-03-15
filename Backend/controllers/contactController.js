import pool from '../config/database.js';

const allowedStatuses = ['Open', 'Addressed'];

export const contactController = {
  submitMessage: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const userId = req.user?.id || null;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'name, email, subject and message are required'
        });
      }

      const connection = await pool.getConnection();

      try {
        const [result] = await connection.query(
          `INSERT INTO contact_messages (userId, name, email, subject, message)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, name.trim(), email.trim(), subject.trim(), message.trim()]
        );

        return res.status(201).json({
          success: true,
          message: 'Message sent successfully',
          data: { id: result.insertId }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error sending contact message',
        error: error.message
      });
    }
  },

  getAllMessages: async (req, res) => {
    try {
      const connection = await pool.getConnection();

      try {
        const [rows] = await connection.query(
          `SELECT cm.id, cm.userId, cm.name, cm.email, cm.subject, cm.message, cm.status,
                  cm.adminReply, cm.repliedBy, cm.repliedAt, cm.createdAt, cm.updatedAt,
                  u.name AS repliedByName
           FROM contact_messages cm
           LEFT JOIN users u ON cm.repliedBy = u.id
           ORDER BY cm.createdAt DESC`
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
        message: 'Error fetching contact messages',
        error: error.message
      });
    }
  },

  replyToMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const { adminReply } = req.body;

      if (!adminReply || !adminReply.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Reply message is required'
        });
      }

      const connection = await pool.getConnection();

      try {
        const [existing] = await connection.query('SELECT id, userId FROM contact_messages WHERE id = ?', [id]);

        if (existing.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Contact message not found'
          });
        }

        await connection.query(
          `UPDATE contact_messages
           SET adminReply = ?, repliedBy = ?, repliedAt = NOW(), updatedAt = NOW()
           WHERE id = ?`,
          [adminReply.trim(), req.user.id, id]
        );

        // Deliver admin reply as a support chat message (null itemId) so the
        // user sees it in the Chat section.
        const targetUserId = existing[0].userId;
        if (targetUserId) {
          await connection.query(
            `INSERT INTO chat_messages (itemId, senderId, receiverId, message, isRead, createdAt)
             VALUES (NULL, ?, ?, ?, 0, NOW())`,
            [req.user.id, targetUserId, adminReply.trim()]
          );

          // Also create a bell notification so the user is alerted
          await connection.query(
            'INSERT INTO notifications (userId, itemId, type, message, isRead, createdAt) VALUES (?, NULL, ?, ?, 0, NOW())',
            [targetUserId, 'message', 'Admin replied to your support message']
          );
        }

        return res.json({
          success: true,
          message: 'Reply saved successfully'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error replying to contact message',
        error: error.message
      });
    }
  },

  updateMessageStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Allowed: Open, Addressed'
        });
      }

      const connection = await pool.getConnection();

      try {
        const [existing] = await connection.query('SELECT id FROM contact_messages WHERE id = ?', [id]);

        if (existing.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Contact message not found'
          });
        }

        await connection.query(
          'UPDATE contact_messages SET status = ?, updatedAt = NOW() WHERE id = ?',
          [status, id]
        );

        return res.json({
          success: true,
          message: `Message marked as ${status}`
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error updating message status',
        error: error.message
      });
    }
  }
};
