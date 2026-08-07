import api from './api';

export const ocrService = {
  extractData: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post('/ocr/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
