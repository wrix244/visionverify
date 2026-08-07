import { Router } from 'express';
import { extractOcrData } from '../controllers/ocr.controller.js';
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

// OCR Extraction Route (Accepts PNG/JPEG/WEBP up to 10MB)
router.post('/extract', verifyFlexAuth, upload.single('file'), extractOcrData);
router.post('/extract-proof', verifyFlexAuth, upload.single('proof'), extractOcrData);

export default router;
