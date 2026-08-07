import { User } from '../models/user.model.js';
import { Admin } from '../models/admin.model.js';
import { RefreshToken } from '../models/refreshToken.model.js';
import { Subscription } from '../models/subscription.model.js';
import { EmailService } from './email.service.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshTokenJWT,
  hashToken,
  generateRandomTokenWithHash
} from '../utils/token.utils.js';

export class AuthService {
  /**
   * Merchant Registration with Email Verification dispatch
   */
  static async registerUser({ name, email, password, companyName }, ipAddress = '', userAgent = '') {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'User with this email already exists');
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      companyName,
      role: 'MERCHANT',
      isEmailVerified: false
    });

    const rawVerificationToken = user.createEmailVerificationToken();
    await user.save();

    // Create Subscription record
    await Subscription.create({ userId: user._id });

    // Send Email Verification Notice
    await EmailService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationToken: rawVerificationToken
    });

    const accessToken = user.generateAccessToken();
    const rawRefreshToken = generateRefreshToken({ id: user._id, role: 'MERCHANT' });

    // Store Refresh Token in DB
    await RefreshToken.create({
      userId: user._id,
      userModel: 'User',
      tokenHash: hashToken(rawRefreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdIp: ipAddress,
      userAgent
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.emailVerificationToken;

    return { user: userObj, accessToken, refreshToken: rawRefreshToken };
  }

  /**
   * Merchant Login
   */
  static async loginUser({ email, password }, ipAddress = '', userAgent = '') {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password credentials');
    }

    if (user.status === 'SUSPENDED') {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Merchant account has been suspended. Please contact support.');
    }

    const accessToken = user.generateAccessToken();
    const rawRefreshToken = generateRefreshToken({ id: user._id, role: 'MERCHANT' });

    await RefreshToken.create({
      userId: user._id,
      userModel: 'User',
      tokenHash: hashToken(rawRefreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdIp: ipAddress,
      userAgent
    });

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, accessToken, refreshToken: rawRefreshToken };
  }

  /**
   * Admin Authentication
   */
  static async adminLogin({ email, password }, ipAddress = '', userAgent = '') {
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid admin credentials');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid admin credentials');
    }

    if (!admin.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Admin account deactivated');
    }

    admin.lastLoginAt = new Date();
    admin.lastLoginIp = ipAddress;
    await admin.save();

    const accessToken = generateAccessToken({
      id: admin._id,
      email: admin.email,
      role: 'ADMIN',
      isSuperAdmin: admin.isSuperAdmin
    });

    const rawRefreshToken = generateRefreshToken({ id: admin._id, role: 'ADMIN' });

    await RefreshToken.create({
      userId: admin._id,
      userModel: 'Admin',
      tokenHash: hashToken(rawRefreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdIp: ipAddress,
      userAgent
    });

    const adminObj = admin.toObject();
    delete adminObj.password;

    return { admin: adminObj, accessToken, refreshToken: rawRefreshToken };
  }

  /**
   * Refresh Token Rotation Strategy
   */
  static async rotateRefreshToken(rawRefreshToken, ipAddress = '', userAgent = '') {
    if (!rawRefreshToken) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Refresh token is required');
    }

    let decoded;
    try {
      decoded = verifyRefreshTokenJWT(rawRefreshToken);
    } catch (err) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    const hashedToken = hashToken(rawRefreshToken);
    const existingRefreshToken = await RefreshToken.findOne({ tokenHash: hashedToken });

    if (!existingRefreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token unrecognized');
    }

    // Token Reuse Detection Security Check: If token was already revoked, invalidate ALL refresh tokens for this user!
    if (existingRefreshToken.isRevoked) {
      await RefreshToken.updateMany({ userId: existingRefreshToken.userId }, { isRevoked: true });
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Security Alert: Revoked refresh token reuse detected. All sessions terminated.');
    }

    // Mark current refresh token as revoked and rotated
    existingRefreshToken.isRevoked = true;
    const newRawRefreshToken = generateRefreshToken({ id: decoded.id, role: decoded.role });
    const newHashedToken = hashToken(newRawRefreshToken);
    existingRefreshToken.replacedByTokenHash = newHashedToken;
    await existingRefreshToken.save();

    // Create new Refresh Token document
    await RefreshToken.create({
      userId: existingRefreshToken.userId,
      userModel: existingRefreshToken.userModel,
      tokenHash: newHashedToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdIp: ipAddress,
      userAgent
    });

    let newAccessToken = '';
    let accountData = null;

    if (existingRefreshToken.userModel === 'User') {
      const user = await User.findById(existingRefreshToken.userId);
      if (!user || user.status === 'SUSPENDED') {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Account unavailable');
      }
      newAccessToken = user.generateAccessToken();
      accountData = user;
    } else {
      const admin = await Admin.findById(existingRefreshToken.userId);
      if (!admin || !admin.isActive) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Admin account inactive');
      }
      newAccessToken = generateAccessToken({
        id: admin._id,
        email: admin.email,
        role: 'ADMIN',
        isSuperAdmin: admin.isSuperAdmin
      });
      accountData = admin;
    }

    return { accessToken: newAccessToken, refreshToken: newRawRefreshToken, account: accountData };
  }

  /**
   * Forgot Password Workflow
   */
  static async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success message to prevent user enumeration security attacks
      return { message: 'If an account exists with that email, a password reset link has been dispatched.' };
    }

    const rawResetToken = user.createPasswordResetToken();
    await user.save();

    await EmailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetToken: rawResetToken
    });

    return { message: 'Password reset link sent to your email.' };
  }

  /**
   * Reset Password Workflow
   */
  static async resetPassword(rawToken, newPassword) {
    const hashedToken = hashToken(rawToken);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired password reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Revoke all existing sessions/refresh tokens for security
    await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });

    return { message: 'Password reset successful. You may now log in with your new password.' };
  }

  /**
   * Verify Email Token Workflow
   */
  static async verifyEmail(rawToken) {
    const hashedToken = hashToken(rawToken);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired email verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return { message: 'Email address verified successfully!' };
  }

  /**
   * Revoke Refresh Token / Logout
   */
  static async logout(rawRefreshToken) {
    if (rawRefreshToken) {
      const hashedToken = hashToken(rawRefreshToken);
      await RefreshToken.updateOne({ tokenHash: hashedToken }, { isRevoked: true });
    }
    return { message: 'Logged out successfully' };
  }
}
