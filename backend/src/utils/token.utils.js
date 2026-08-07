import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';

/**
 * Generate short-lived Access Token (JWT)
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn || '15m'
  });
};

/**
 * Generate long-lived Refresh Token (JWT)
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'supersecret_verifyflow_refresh_key', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });
};

/**
 * Verify Refresh Token JWT
 */
export const verifyRefreshTokenJWT = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'supersecret_verifyflow_refresh_key');
};

/**
 * Generate cryptographically secure random token (Hex string) & its SHA-256 hash
 */
export const generateRandomTokenWithHash = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, tokenHash };
};

/**
 * Hash a plain string token using SHA-256
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
