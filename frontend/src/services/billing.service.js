import api from './api';

export const billingService = {
  getSubscription: async () => {
    return await api.get('/billing/subscription');
  },
  upgradePlan: async (tier) => {
    return await api.post('/billing/upgrade', { tier });
  },
  createCheckoutSession: async (tier) => {
    return await api.post('/billing/create-checkout-session', { tier });
  }
};
