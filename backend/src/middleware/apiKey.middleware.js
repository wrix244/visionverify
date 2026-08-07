import { hashSecretKey } from '../utils/keyGenerator.js';
import { ApiKey } from '../models/apiKey.model.js';
import { ApiUsageLog } from '../models/apiUsageLog.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS, API_KEY_STATUS } from '../config/constants.js';

export const verifyApiKey = async (req, res, next) => {
  const startTime = Date.now();

  try {
    const rawSecretKey = req.header('x-api-key') || req.header('X-API-KEY');
    const rawPublicKey = req.header('x-public-key') || req.header('X-PUBLIC-KEY');

    if (!rawSecretKey && !rawPublicKey) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'API credentials missing. Provide x-api-key (sk_live_...) or x-public-key (pk_live_...) header.');
    }

    let apiKeyDoc = null;

    if (rawSecretKey) {
      const hashedSecret = hashSecretKey(rawSecretKey);
      apiKeyDoc = await ApiKey.findOne({ secretKeyHash: hashedSecret });
    } else if (rawPublicKey) {
      apiKeyDoc = await ApiKey.findOne({ publicKey: rawPublicKey });
    }

    if (!apiKeyDoc) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid API Key provided');
    }

    // Check expiration
    if (apiKeyDoc.expiresAt && apiKeyDoc.expiresAt < new Date()) {
      apiKeyDoc.status = API_KEY_STATUS.EXPIRED;
      await apiKeyDoc.save();
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'API key has expired');
    }

    if (apiKeyDoc.status !== API_KEY_STATUS.ACTIVE) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, `API key is ${apiKeyDoc.status.toLowerCase()}`);
    }

    const user = await User.findById(apiKeyDoc.userId);
    if (!user || user.status === 'SUSPENDED') {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Merchant account is inactive or suspended');
    }

    // Update key usage counters asynchronously
    apiKeyDoc.usageCount += 1;
    apiKeyDoc.lastUsedAt = new Date();
    await apiKeyDoc.save();

    req.user = user;
    req.apiKey = apiKeyDoc;

    // Attach response finish listener for API usage audit logging
    res.on('finish', () => {
      const responseTimeMs = Date.now() - startTime;
      const ipAddress = req.ip || req.connection.remoteAddress || '';
      const userAgent = req.get('User-Agent') || '';

      ApiUsageLog.create({
        userId: user._id,
        apiKeyId: apiKeyDoc._id,
        endpoint: req.originalUrl || req.url,
        method: req.method,
        statusCode: res.statusCode,
        ipAddress,
        userAgent,
        responseTimeMs
      }).catch(err => console.error('Failed to log API usage:', err));
    });

    next();
  } catch (error) {
    next(error);
  }
};
