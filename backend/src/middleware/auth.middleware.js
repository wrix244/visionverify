import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';
import { User } from '../models/user.model.js';
import { Admin } from '../models/admin.model.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized request. Access token is missing.');
    }

    const decodedToken = jwt.verify(token, config.jwtSecret);

    let user = null;
    if (decodedToken.role === 'ADMIN') {
      user = await Admin.findById(decodedToken.id).select('-password');
    } else {
      user = await User.findById(decodedToken.id).select('-password');
    }

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid access token. Account does not exist.');
    }

    if (user.status === 'SUSPENDED' || (user.isActive !== undefined && !user.isActive)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Account is suspended or deactivated.');
    }

    req.user = user;
    req.role = user.role;
    next();
  } catch (error) {
    next(new ApiError(HTTP_STATUS.UNAUTHORIZED, error?.message || 'Invalid or expired access token'));
  }
};

/**
 * Role System Guard Middleware
 * Example: authorizeRoles('ADMIN') or authorizeRoles('MERCHANT', 'ADMIN')
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Role '${req.user?.role || 'UNKNOWN'}' is not authorized to access this resource`
        )
      );
    }
    next();
  };
};

/**
 * Enforce Email Verification Requirement
 */
export const requireEmailVerified = (req, res, next) => {
  if (req.user && req.user.role === 'MERCHANT' && !req.user.isEmailVerified) {
    return next(
      new ApiError(
        HTTP_STATUS.FORBIDDEN,
        'Email address not verified. Please verify your email address to access this feature.'
      )
    );
  }
  next();
};
