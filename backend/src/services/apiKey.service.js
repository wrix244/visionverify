import { ApiKey } from '../models/apiKey.model.js';
import { ApiUsageLog } from '../models/apiUsageLog.model.js';
import { generateKeyPair } from '../utils/keyGenerator.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS, API_KEY_STATUS } from '../config/constants.js';

export class ApiKeyService {
  /**
   * Create a new pk_live & sk_live API Key Pair
   */
  static async createKeyPair(userId, name, expiresAt = null) {
    const { publicKey, secretKey, secretKeyPrefix, secretKeyHash } = generateKeyPair();

    let parsedExpiresAt = null;
    if (expiresAt) {
      parsedExpiresAt = new Date(expiresAt);
      if (isNaN(parsedExpiresAt.getTime())) {
        parsedExpiresAt = null;
      }
    }

    const apiKey = await ApiKey.create({
      userId,
      name,
      publicKey,
      secretKeyPrefix,
      secretKeyHash,
      status: API_KEY_STATUS.ACTIVE,
      expiresAt: parsedExpiresAt
    });

    return {
      id: apiKey._id,
      name: apiKey.name,
      publicKey: apiKey.publicKey,
      secretKeyPrefix: apiKey.secretKeyPrefix,
      secretKey, // Unhashed secret key returned ONLY ONCE!
      expiresAt: apiKey.expiresAt,
      status: apiKey.status,
      createdAt: apiKey.createdAt
    };
  }

  /**
   * Regenerate / Rotate an API Key Pair
   * Revokes the existing key pair and issues new pk_live & sk_live
   */
  static async regenerateKeyPair(userId, keyId) {
    const existingKey = await ApiKey.findOne({ _id: keyId, userId });
    if (!existingKey) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'API Key not found or does not belong to merchant');
    }

    // Revoke old key pair
    existingKey.status = API_KEY_STATUS.REVOKED;
    await existingKey.save();

    // Generate new key pair with original key name and expiration settings
    const newKeyPair = await this.createKeyPair(userId, existingKey.name, existingKey.expiresAt);
    return newKeyPair;
  }

  /**
   * List All API Keys for Merchant
   */
  static async listKeys(userId) {
    const keys = await ApiKey.find({ userId })
      .select('-secretKeyHash')
      .sort({ createdAt: -1 });

    // Update status to EXPIRED for any key past expiration date
    const now = new Date();
    for (const key of keys) {
      if (key.status === API_KEY_STATUS.ACTIVE && key.expiresAt && key.expiresAt < now) {
        key.status = API_KEY_STATUS.EXPIRED;
        await key.save();
      }
    }

    return keys;
  }

  /**
   * Revoke Key Pair
   */
  static async revokeKey(userId, keyId) {
    const apiKey = await ApiKey.findOne({ _id: keyId, userId });
    if (!apiKey) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'API Key not found');
    }

    apiKey.status = API_KEY_STATUS.REVOKED;
    await apiKey.save();
    return apiKey;
  }

  /**
   * Get API Usage Audit Logs
   */
  static async getUsageLogs(userId, { apiKeyId, page = 1, limit = 20 }) {
    const query = { userId };
    if (apiKeyId) {
      query.apiKeyId = apiKeyId;
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ApiUsageLog.find(query)
        .populate('apiKeyId', 'name publicKey secretKeyPrefix')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      ApiUsageLog.countDocuments(query)
    ]);

    return {
      logs,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
