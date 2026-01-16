import api from './api';

export const authService = {
  // Register new user
  register: async (email, password, username) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      username,
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Get current user
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
