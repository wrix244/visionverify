import mongoose from 'mongoose';
import { config } from './env.config.js';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Database Connection Error: ${error.message}`);
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
  }
};
