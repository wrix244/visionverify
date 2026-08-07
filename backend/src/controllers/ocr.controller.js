import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { OcrEngineService } from '../services/ocr/ocr.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const extractOcrData = asyncHandler(async (req, res) => {
  const file = req.file || req.files?.file || req.files?.proof;

  if (!file || !file.buffer) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Payment screenshot image file is required (multipart/form-data field: file or proof)');
  }

  const result = await OcrEngineService.processImage(file.buffer);

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result.data, 'OCR extraction completed successfully'));
});
