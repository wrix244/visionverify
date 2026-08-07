import { Subscription } from '../models/subscription.model.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS, TIER_LIMITS } from '../config/constants.js';

/**
 * Real-Time API Request Metering Guard & Monthly Reset Evaluator
 */
export const checkAndIncrementQuota = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return next();
    }

    let subscription = await Subscription.findOne({ userId: req.user._id });
    if (!subscription) {
      subscription = await Subscription.create({ userId: req.user._id });
    }

    const now = new Date();

    // 1. Automatic Monthly Quota Reset Check
    if (subscription.quotaResetDate && now >= subscription.quotaResetDate) {
      subscription.usedQuota = 0;
      subscription.quotaResetDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      await subscription.save();
    }

    // 2. Quota Metering Limit Enforcement
    if (subscription.usedQuota >= subscription.monthlyQuota) {
      throw new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        `Monthly API quota exceeded (${subscription.usedQuota}/${subscription.monthlyQuota} used). Please upgrade your subscription plan.`
      );
    }

    // 3. Increment Used Quota Count
    subscription.usedQuota += 1;
    await subscription.save();

    req.subscription = subscription;
    next();
  } catch (error) {
    next(error);
  }
};
