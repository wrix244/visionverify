import { Router } from 'express';
import { validatePaymentData } from '../controllers/validation.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { verifyApiKey } from '../middleware/apiKey.middleware.js';

const router = Router();

const verifyFlexAuth = (req, res, next) => {
  if (req.header('x-api-key') || req.header('X-API-KEY') || req.header('x-public-key')) {
    return verifyApiKey(req, res, next);
  }
  return verifyJWT(req, res, next);
};

// Validation Reconciliation Endpoint
router.post('/validate', verifyFlexAuth, validatePaymentData);

export default router;
