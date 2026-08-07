import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiKeyService } from '../services/apiKey.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const createApiKey = asyncHandler(async (req, res) => {
  const { name, expiresAt } = req.body;
  const apiKeyData = await ApiKeyService.createKeyPair(
    req.user._id,
    name || 'Production API Key',
    expiresAt
  );
  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        apiKeyData,
        'API Key pair created successfully. Store your secret key (sk_live_...) safely, it will not be displayed again!'
      )
    );
});

export const regenerateApiKey = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const newKeyData = await ApiKeyService.regenerateKeyPair(req.user._id, id);
  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        newKeyData,
        'API Key pair regenerated successfully. Old keys have been revoked.'
      )
    );
});

export const getApiKeys = asyncHandler(async (req, res) => {
  const keys = await ApiKeyService.listKeys(req.user._id);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, keys, 'API Key credentials retrieved successfully'));
});

export const revokeApiKey = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const revokedKey = await ApiKeyService.revokeKey(req.user._id, id);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, revokedKey, 'API Key revoked successfully'));
});

export const getApiUsageLogs = asyncHandler(async (req, res) => {
  const { apiKeyId, page, limit } = req.query;
  const logsData = await ApiKeyService.getUsageLogs(req.user._id, { apiKeyId, page, limit });
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, logsData, 'API Usage logs retrieved successfully'));
});
