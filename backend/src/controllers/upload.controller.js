import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { UploadService } from '../services/upload.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const uploadImage = asyncHandler(async (req, res) => {
  const file = req.file || req.files?.file || req.files?.proof;

  if (!file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please provide an image file in multipart/form-data (field: file or proof)');
  }

  const result = await UploadService.processImageUpload(file, req.user._id);

  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, result, 'Image uploaded successfully to Cloudinary'));
});

export const getUploadHistory = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const history = await UploadService.getUploadHistory(req.user._id, { page, limit });
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, history, 'Upload history fetched successfully'));
});

export const getUploadById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const uploadRecord = await UploadService.getUploadById(req.user._id, id);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, uploadRecord, 'Upload metadata record retrieved'));
});
