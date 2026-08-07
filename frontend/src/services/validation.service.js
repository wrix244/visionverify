import api from './api';

export const validationService = {
  validateData: async (payload) => {
    return await api.post('/validation/validate', payload);
  }
};
