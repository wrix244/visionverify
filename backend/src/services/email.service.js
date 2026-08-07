import { logger } from '../utils/logger.js';
import { config } from '../config/env.config.js';

export class EmailService {
  /**
   * Send Email Verification Link to Merchant
   */
  static async sendVerificationEmail({ email, name, verificationToken }) {
    const verificationUrl = `${config.clientUrl}/verify-email?token=${verificationToken}`;

    logger.info(`[EMAIL SERVICE] Sending Email Verification to ${email}`);
    logger.info(`[EMAIL SERVICE] Link: ${verificationUrl}`);

    // Fallback or Nodemailer SMTP dispatch logic
    return {
      success: true,
      verificationUrl
    };
  }

  /**
   * Send Password Reset Link to Merchant / Admin
   */
  static async sendPasswordResetEmail({ email, name, resetToken }) {
    const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;

    logger.info(`[EMAIL SERVICE] Sending Password Reset to ${email}`);
    logger.info(`[EMAIL SERVICE] Link: ${resetUrl}`);

    return {
      success: true,
      resetUrl
    };
  }
}
