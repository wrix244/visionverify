import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { HTTP_STATUS } from '../config/constants.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, companyName, webhookUrl } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, companyName, webhookUrl },
    { new: true, runValidators: true }
  ).select('-password');

  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, user, 'Profile updated successfully'));
});
