import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userModel'
    },
    userModel: {
      type: String,
      required: true,
      enum: ['User', 'Admin']
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // Auto TTL index to clear expired refresh tokens
    },
    isRevoked: {
      type: Boolean,
      default: false
    },
    replacedByTokenHash: {
      type: String,
      default: null
    },
    createdIp: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
