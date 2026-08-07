import api from './api';

export const apiKeyService = {
  getApiKeys: async () => {
    return await api.get('/keys');
  },
  createApiKey: async (name, expiresAt = null) => {
    return await api.post('/keys', { name, expiresAt });
  },
  regenerateApiKey: async (id) => {
    return await api.post(`/keys/${id}/regenerate`);
  },
  revokeApiKey: async (id) => {
    return await api.delete(`/keys/${id}`);
  },
  getUsageLogs: async (params = {}) => {
    return await api.get('/keys/logs', { params });
  }
};
