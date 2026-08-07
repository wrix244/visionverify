import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { validationEngineService } from '../services/validation/validation.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const validatePaymentData = asyncHandler(async (req, res) => {
  const { ocrData, expectedAmount, expectedUpiId, expectedMerchantName, expectedRecipient, timeWindowMinutes, expectedBank } = req.body;

  if (!ocrData) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'ocrData payload is required for validation');
  }

  const expectedData = {
    expectedAmount,
    expectedUpiId,
    expectedMerchantName: expectedMerchantName || expectedRecipient,
    expectedRecipient,
    timeWindowMinutes: timeWindowMinutes || 60,
    expectedBank
  };

  const result = await validationEngineService.validatePaymentData(ocrData, expectedData);

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result.data, 'Validation checks completed'));
});
