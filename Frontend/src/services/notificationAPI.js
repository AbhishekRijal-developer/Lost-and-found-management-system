import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const createAxiosInstance = () => {
  const token = getToken();
  return axios.create({
    baseURL: `${API_URL}/notifications`,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

export const notificationAPI = {
  // Create notification
  createNotification: async (userId, itemId, type, message) => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.post('/', {
        userId,
        itemId,
        type,
        message
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error creating notification' };
    }
  },

  // Get user's notifications
  getNotifications: async (page = 1, limit = 10, unreadOnly = false) => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.get('/', {
        params: { page, limit, unreadOnly }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error fetching notifications' };
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.put(`/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error marking notification as read' };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.put('/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error marking notifications as read' };
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error deleting notification' };
    }
  }
};
