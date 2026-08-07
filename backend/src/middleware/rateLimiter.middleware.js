import rateLimit from 'express-rate-limit';
import { config } from '../config/env.config.js';
import { HTTP_STATUS } from '../config/constants.js';

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Stricter Rate Limiter for Login, Registration & Password Reset to protect against brute-force attacks
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Max 10 login/signup/reset attempts per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});
