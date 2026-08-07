import { Router } from 'express';
import { verifyPaymentProof, getVerificationLogs, getVerificationById, getMetrics } from '../controllers/verification.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { verifyApiKey } from '../middleware/apiKey.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { checkAndIncrementQuota } from '../middleware/subscription.middleware.js';

const router = Router();

const verifyFlexAuth = (req, res, next) => {
  if (req.header('x-api-key') || req.header('X-API-KEY') || req.header('x-public-key')) {
    return verifyApiKey(req, res, next);
  }
  return verifyJWT(req, res, next);
};

// Unified Verification Pipeline Endpoints (Accepts PNG/JPEG/WEBP up to 10MB)
router.post('/verify', verifyFlexAuth, checkAndIncrementQuota, upload.single('proof'), verifyPaymentProof);
router.post('/upload', verifyFlexAuth, checkAndIncrementQuota, upload.single('proof'), verifyPaymentProof);

// Dashboard audit routes
router.get('/logs', verifyJWT, getVerificationLogs);
router.get('/metrics', verifyJWT, getMetrics);
router.get('/logs/:id', verifyJWT, getVerificationById);

export default router;
