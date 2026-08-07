import { Router } from 'express';
import { updateProfile } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJWT);
router.patch('/profile', updateProfile);

export default router;
