import api from './api';

export const verificationService = {
  verifyPaymentProof: async (formData) => {
    return await api.post('/verifications/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadProof: async (formData) => {
    return await api.post('/verifications/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getLogs: async (params = {}) => {
    return await api.get('/verifications/logs', { params });
  },
  getMetrics: async () => {
    return await api.get('/verifications/metrics');
  },
  getVerificationById: async (id) => {
    return await api.get(`/verifications/logs/${id}`);
  }
};
