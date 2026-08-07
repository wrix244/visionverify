import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { BillingService } from '../services/billing.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const getSubscription = asyncHandler(async (req, res) => {
  const subscription = await BillingService.getSubscriptionDetails(req.user._id);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, subscription, 'Subscription details retrieved successfully'));
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const { tier } = req.body;
  const updatedSubscription = await BillingService.updatePlan(req.user._id, tier);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, updatedSubscription, `Subscription plan updated to ${tier}`));
});

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { tier } = req.body;
  const sessionData = await BillingService.createCheckoutSession(req.user._id, tier);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, sessionData, 'Stripe checkout session initialized'));
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  const event = req.body;
  const result = await BillingService.handleStripeWebhook(event);
  return res.status(HTTP_STATUS.OK).json(result);
});
