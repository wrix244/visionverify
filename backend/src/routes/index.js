import { Router } from 'express';
import authRoutes from './auth.routes.js';
import apiKeyRoutes from './apiKey.routes.js';
import verificationRoutes from './verification.routes.js';
import uploadRoutes from './upload.routes.js';
import ocrRoutes from './ocr.routes.js';
import fraudRoutes from './fraud.routes.js';
import validationRoutes from './validation.routes.js';
import userRoutes from './user.routes.js';
import billingRoutes from './billing.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/keys', apiKeyRoutes);
router.use('/verifications', verificationRoutes);
router.use('/uploads', uploadRoutes);
router.use('/ocr', ocrRoutes);
router.use('/fraud', fraudRoutes);
router.use('/validation', validationRoutes);
router.use('/user', userRoutes);
router.use('/billing', billingRoutes);

export default router;
