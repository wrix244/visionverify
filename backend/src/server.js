import { app } from './app.js';
import { config } from './config/env.config.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      logger.info(`VerifyFlow Server running on port ${config.port} in ${config.nodeEnv} mode`);
      logger.info(`API Base URL: http://localhost:${config.port}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
