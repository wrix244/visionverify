import mongoose from 'mongoose';

const uploadMetadataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    },
    size: {
      type: Number,
      required: true,
      max: 10 * 1024 * 1024 // 10MB Max File Size limit
    },
    url: {
      type: String,
      required: true
    },
    cloudinaryPublicId: {
      type: String,
      default: ''
    },
    folder: {
      type: String,
      default: 'verifyflow/proofs'
    }
  },
  {
    timestamps: true
  }
);

export const UploadMetadata = mongoose.model('UploadMetadata', uploadMetadataSchema);
