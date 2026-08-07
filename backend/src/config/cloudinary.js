import { v2 as cloudinary } from 'cloudinary';
import { config } from './env.config.js';
import { logger } from '../utils/logger.js';

if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
  });
  logger.info('Cloudinary Storage Service Configured');
} else {
  logger.info('Cloudinary credentials missing - Uploads will fallback to mock storage mode');
}

export { cloudinary };
