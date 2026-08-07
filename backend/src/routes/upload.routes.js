import { Router } from 'express';
import { uploadImage, getUploadHistory, getUploadById } from '../controllers/upload.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { verifyApiKey } from '../middleware/apiKey.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// Middleware supporting either JWT Token OR API Key (x-api-key)
const verifyFlexAuth = (req, res, next) => {
  if (req.header('x-api-key') || req.header('X-API-KEY') || req.header('x-public-key')) {
    return verifyApiKey(req, res, next);
  }
  return verifyJWT(req, res, next);
};

// Primary Upload Endpoint (Accepts PNG, JPEG, JPG, WEBP up to 10MB)
router.post('/', verifyFlexAuth, upload.single('file'), uploadImage);
router.post('/proof', verifyFlexAuth, upload.single('proof'), uploadImage);

// Merchant Upload History Routes
router.get('/', verifyJWT, getUploadHistory);
router.get('/:id', verifyJWT, getUploadById);

export default router;
