import { Router } from 'express';
import { analyzeFraud } from '../controllers/fraud.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { verifyApiKey } from '../middleware/apiKey.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

const verifyFlexAuth = (req, res, next) => {
  if (req.header('x-api-key') || req.header('X-API-KEY') || req.header('x-public-key')) {
    return verifyApiKey(req, res, next);
  }
  return verifyJWT(req, res, next);
};

// Fraud Detection Route (Accepts PNG/JPEG/WEBP up to 10MB)
router.post('/analyze', verifyFlexAuth, upload.single('file'), analyzeFraud);
router.post('/analyze-proof', verifyFlexAuth, upload.single('proof'), analyzeFraud);

export default router;
