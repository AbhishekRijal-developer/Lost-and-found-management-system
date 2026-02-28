const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls with token
export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  register: (userData) => apiCall('/auth/register', 'POST', userData),
  login: (email, password) => apiCall('/auth/login', 'POST', { email, password }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Item APIs
export const itemAPI = {
  getAllItems: () => apiCall('/items'),
  getItemById: (id) => apiCall(`/items/${id}`),
  createItem: (itemData) => apiCall('/items', 'POST', itemData),
  updateItem: (id, itemData) => apiCall(`/items/${id}`, 'PUT', itemData),
  deleteItem: (id) => apiCall(`/items/${id}`, 'DELETE'),
  getMyItems: () => apiCall('/items/user/my-items'),
  searchItems: (query) => apiCall(`/items/search?q=${query}`),
};

// Match/Claim APIs
export const matchAPI = {
  claimItem: (claimData) => apiCall('/matches/claim', 'POST', claimData),
  getMyMatches: () => apiCall('/matches/my-matches'),
  updateMatchStatus: (matchId, status) => apiCall(`/matches/${matchId}`, 'PUT', { status }),
};
