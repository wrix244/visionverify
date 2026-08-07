import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { VerificationService } from '../services/verification.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const verifyPaymentProof = asyncHandler(async (req, res) => {
  const file = req.file || req.files?.file || req.files?.proof;
  if (!file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Payment screenshot file is required (multipart/form-data field: proof or file)');
  }

  const { expectedAmount, expectedUpiId, expectedMerchantName, timeWindowMinutes } = req.body;

  const result = await VerificationService.executeUnifiedPipeline({
    userId: req.user._id,
    apiKeyId: req.apiKey ? req.apiKey._id : null,
    file,
    expectedAmount,
    expectedUpiId,
    expectedMerchantName,
    timeWindowMinutes,
    source: req.apiKey ? 'API' : 'DASHBOARD'
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result, 'Unified payment proof verification pipeline completed'));
});

export const getVerificationLogs = asyncHandler(async (req, res) => {
  const { page, limit, status, search, dateRange, minConfidence, maxConfidence } = req.query;
  const result = await VerificationService.getLogs(req.user._id, {
    page,
    limit,
    status,
    search,
    dateRange,
    minConfidence,
    maxConfidence
  });
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, 'Verification logs retrieved successfully'));
});

export const getVerificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const log = await VerificationService.getVerificationById(req.user._id, id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, log, 'Verification record retrieved successfully'));
});

export const getMetrics = asyncHandler(async (req, res) => {
  const metricsData = await VerificationService.getDashboardMetrics(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, metricsData, 'Dashboard metrics retrieved successfully'));
});
