import { cloudinary } from '../config/cloudinary.js';
import { UploadMetadata } from '../models/uploadMetadata.model.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export class UploadService {
  /**
   * Upload image buffer to Cloudinary & store metadata in MongoDB
   */
  static async processImageUpload(file, userId, folder = 'verifyflow/proofs') {
    if (!file || !file.buffer) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No image file provided in request');
    }

    const { originalname, mimetype, size, buffer } = file;

    // 1. Upload Buffer to Cloudinary (or fallback mock URL)
    const cloudinaryResult = await this.uploadToCloudinary(buffer, folder);

    // 2. Persist Metadata Record in MongoDB
    const metadata = await UploadMetadata.create({
      userId,
      originalName: originalname,
      fileName: `${Date.now()}_${originalname.replace(/\s+/g, '_')}`,
      mimeType: mimetype,
      size,
      url: cloudinaryResult.url,
      cloudinaryPublicId: cloudinaryResult.publicId,
      folder
    });

    return {
      id: metadata._id,
      url: metadata.url,
      publicId: metadata.cloudinaryPublicId,
      originalName: metadata.originalName,
      mimeType: metadata.mimeType,
      size: metadata.size,
      uploadedAt: metadata.createdAt
    };
  }

  /**
   * Helper: Cloudinary Stream Upload with mock fallback
   */
  static async uploadToCloudinary(fileBuffer, folder) {
    return new Promise((resolve, reject) => {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }]
          },
          (error, result) => {
            if (error) {
              logger.error('Cloudinary Upload Stream Error:', error);
              return reject(new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to upload image to storage service'));
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        );
        uploadStream.end(fileBuffer);
      } else {
        // Fallback mock upload URL for development without Cloudinary credentials
        const mockPublicId = `proof_mock_${Date.now()}`;
        resolve({
          url: `https://images.unsplash.com/photo-1556742049-0a67daf64f4d?w=1000&auto=format&fit=crop&q=80`,
          publicId: mockPublicId
        });
      }
    });
  }

  /**
   * Get Merchant Upload History
   */
  static async getUploadHistory(userId, { page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [uploads, total] = await Promise.all([
      UploadMetadata.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      UploadMetadata.countDocuments({ userId })
    ]);

    return {
      uploads,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get Single Upload Metadata by ID
   */
  static async getUploadById(userId, uploadId) {
    const record = await UploadMetadata.findOne({ _id: uploadId, userId });
    if (!record) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Upload metadata record not found');
    }
    return record;
  }
}
