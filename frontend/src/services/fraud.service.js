import api from './api';

export const fraudService = {
  analyzeScreenshot: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post('/fraud/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
