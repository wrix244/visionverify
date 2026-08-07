import api from './api';

export const authService = {
  signup: async (userData) => {
    return await api.post('/auth/signup', userData);
  },
  register: async (userData) => {
    return await api.post('/auth/signup', userData);
  },
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },
  adminLogin: async (credentials) => {
    return await api.post('/auth/admin/login', credentials);
  },
  refreshToken: async (refreshTokenValue) => {
    return await api.post('/auth/refresh-token', { refreshToken: refreshTokenValue });
  },
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },
  resetPassword: async (token, password) => {
    return await api.post('/auth/reset-password', { token, password });
  },
  verifyEmail: async (token) => {
    return await api.get(`/auth/verify-email/${token}`);
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return await api.post('/auth/logout', { refreshToken });
  },
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },
  updateProfile: async (profileData) => {
    return await api.patch('/user/profile', profileData);
  }
};
