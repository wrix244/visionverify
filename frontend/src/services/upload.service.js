import api from './api';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getUploadHistory: async (params = {}) => {
    return await api.get('/uploads', { params });
  },
  getUploadById: async (id) => {
    return await api.get(`/uploads/${id}`);
  }
};
