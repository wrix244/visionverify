import mongoose from 'mongoose';
import { SUBSCRIPTION_TIERS, TIER_LIMITS } from '../config/constants.js';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    tier: {
      type: String,
      enum: Object.values(SUBSCRIPTION_TIERS),
      default: SUBSCRIPTION_TIERS.FREE
    },
    monthlyQuota: {
      type: Number,
      default: TIER_LIMITS.FREE.MONTHLY_VERIFICATIONS
    },
    usedQuota: {
      type: Number,
      default: 0
    },
    quotaResetDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAST_DUE', 'CANCELLED'],
      default: 'ACTIVE'
    },
    // Stripe Integration Fields
    stripeCustomerId: {
      type: String,
      default: ''
    },
    stripeSubscriptionId: {
      type: String,
      default: ''
    },
    stripePriceId: {
      type: String,
      default: ''
    },
    stripeCurrentPeriodEnd: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
