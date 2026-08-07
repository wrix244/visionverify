import { Router } from 'express';
import {
  createApiKey,
  regenerateApiKey,
  getApiKeys,
  revokeApiKey,
  getApiUsageLogs
} from '../controllers/apiKey.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/')
  .get(getApiKeys)
  .post(createApiKey);

router.post('/:id/regenerate', regenerateApiKey);
router.delete('/:id', revokeApiKey);
router.get('/logs', getApiUsageLogs);

export default router;
