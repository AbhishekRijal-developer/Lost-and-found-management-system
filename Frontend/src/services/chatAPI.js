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
    baseURL: `${API_URL}/chat`,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

export const chatAPI = {
  // Send message
  sendMessage: async (itemId, receiverId, message) => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.post('/send', {
        itemId,
        receiverId,
        message
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error sending message' };
    }
  },

  // Get messages for a conversation
  getMessages: async (itemId, otherUserId, page = 1, limit = 20) => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.get('/messages', {
        params: {
          itemId,
          otherUserId,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error fetching messages' };
    }
  },

  // Get all conversations
  getConversations: async (page = 1, limit = 10) => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.get('/conversations', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error fetching conversations' };
    }
  },

  // Mark messages as read
  markAsRead: async (itemId, otherUserId) => {
    try {
      const instance = createAxiosInstance();
      const response = await instance.put('/read', {
        itemId,
        otherUserId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error marking messages as read' };
    }
  }
};
