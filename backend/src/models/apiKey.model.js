import mongoose from 'mongoose';
import { API_KEY_STATUS } from '../config/constants.js';

const apiKeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'API Key name is required'],
      trim: true
    },
    publicKey: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    secretKeyPrefix: {
      type: String,
      required: true
    },
    secretKeyHash: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(API_KEY_STATUS),
      default: API_KEY_STATUS.ACTIVE,
      index: true
    },
    usageCount: {
      type: Number,
      default: 0
    },
    lastUsedAt: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null // null means Never expires
    }
  },
  {
    timestamps: true
  }
);

export const ApiKey = mongoose.model('ApiKey', apiKeySchema);
