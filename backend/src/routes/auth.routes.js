import { Router } from 'express';
import {
  register,
  login,
  adminLogin,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  getCurrentUser
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validateBody, validateAuthInput } from '../middleware/validate.middleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

// Merchant Registration
router.post(
  '/signup',
  authRateLimiter,
  validateBody(['name', 'email', 'password']),
  validateAuthInput,
  register
);

// Merchant Login
router.post(
  '/login',
  authRateLimiter,
  validateBody(['email', 'password']),
  login
);

// Admin Dedicated Login
router.post(
  '/admin/login',
  authRateLimiter,
  validateBody(['email', 'password']),
  adminLogin
);

// Refresh Token Endpoint
router.post('/refresh-token', refreshToken);

// Forgot Password
router.post(
  '/forgot-password',
  authRateLimiter,
  validateBody(['email']),
  forgotPassword
);

// Reset Password Confirm
router.post(
  '/reset-password',
  authRateLimiter,
  validateBody(['token', 'password']),
  validateAuthInput,
  resetPassword
);

// Email Verification Link Confirm
router.get('/verify-email/:token', verifyEmail);

// Logout
router.post('/logout', logout);

// Get Current User Profile
router.get('/me', verifyJWT, getCurrentUser);

export default router;
