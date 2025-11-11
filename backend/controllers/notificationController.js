// notificationController.js
import pool from '../db.js';

// Create notification
export const createNotification = async (userId, title, message, type, relatedRequestId = null) => {
  try {
    const query = `
      INSERT INTO notifications (user_id, title, message, type, related_request_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, title, message, type, relatedRequestId]);
    return result.rows[0];
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { unreadOnly } = req.query;

    let query = `
      SELECT 
        n.*,
        er.patient_name,
        er.emergency_type,
        er.status as request_status
      FROM notifications n
      LEFT JOIN emergency_requests er ON n.related_request_id = er.id
      WHERE n.user_id = $1
    `;

    const params = [userId];

    if (unreadOnly === 'true') {
      query += ' AND n.is_read = false';
    }

    query += ' ORDER BY n.created_at DESC LIMIT 50';

    const result = await pool.query(query, params);

    res.json({ notifications: result.rows });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ 
      message: 'Notification marked as read',
      notification: result.rows[0] 
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = $1 AND is_read = false
      RETURNING COUNT(*)
    `;

    await pool.query(query, [userId]);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const query = 'DELETE FROM notifications WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT COUNT(*) as unread_count
      FROM notifications
      WHERE user_id = $1 AND is_read = false
    `;

    const result = await pool.query(query, [userId]);

    res.json({ unreadCount: parseInt(result.rows[0].unread_count) });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};
