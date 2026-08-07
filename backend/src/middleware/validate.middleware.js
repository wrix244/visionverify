import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';

export const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(
      field => !req.body || req.body[field] === undefined || req.body[field] === ''
    );

    if (missingFields.length > 0) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, `Missing required fields: ${missingFields.join(', ')}`));
    }

    next();
  };
};

/**
 * Validate Signup & Reset Password details
 */
export const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid email address format'));
    }
  }

  if (password) {
    if (password.length < 8) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Password must be at least 8 characters long'));
    }
  }

  next();
};
