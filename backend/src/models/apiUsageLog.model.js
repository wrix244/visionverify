import mongoose from 'mongoose';

const apiUsageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApiKey',
      required: true,
      index: true
    },
    endpoint: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    statusCode: {
      type: Number,
      required: true
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    },
    responseTimeMs: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// TTL index to automatically purge logs older than 90 days
apiUsageLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const ApiUsageLog = mongoose.model('ApiUsageLog', apiUsageLogSchema);
