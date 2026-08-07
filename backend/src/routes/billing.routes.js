import { Router } from 'express';
import {
  getSubscription,
  updateSubscription,
  createCheckoutSession,
  stripeWebhook
} from '../controllers/billing.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Public Stripe Webhook Endpoint
router.post('/stripe-webhook', stripeWebhook);

// Protected Merchant Routes
router.use(verifyJWT);
router.get('/subscription', getSubscription);
router.post('/upgrade', updateSubscription);
router.post('/create-checkout-session', createCheckoutSession);

export default router;
