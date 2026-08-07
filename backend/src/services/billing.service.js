import { Subscription } from '../models/subscription.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS, SUBSCRIPTION_TIERS, TIER_LIMITS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export class BillingService {
  /**
   * Get Merchant Subscription & Quota Usage
   */
  static async getSubscriptionDetails(userId) {
    let subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      subscription = await Subscription.create({ userId });
    }

    // Auto Reset Check
    const now = new Date();
    if (subscription.quotaResetDate && now >= subscription.quotaResetDate) {
      subscription.usedQuota = 0;
      subscription.quotaResetDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      await subscription.save();
    }

    return subscription;
  }

  /**
   * Directly Update Plan Tier
   */
  static async updatePlan(userId, newTier) {
    const tierKey = newTier?.toUpperCase();
    if (!TIER_LIMITS[tierKey]) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid subscription tier '${newTier}'`);
    }

    let subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      subscription = await Subscription.create({ userId });
    }

    subscription.tier = tierKey;
    subscription.monthlyQuota = TIER_LIMITS[tierKey].MONTHLY_VERIFICATIONS;
    subscription.status = 'ACTIVE';
    await subscription.save();

    await User.findByIdAndUpdate(userId, { subscriptionTier: tierKey });
    return subscription;
  }

  /**
   * Generate Stripe-Ready Checkout Session Payload
   */
  static async createCheckoutSession(userId, tier) {
    const tierKey = tier?.toUpperCase();
    if (!TIER_LIMITS[tierKey]) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid subscription tier '${tier}'`);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    const priceDetails = TIER_LIMITS[tierKey];

    // Stripe Checkout Session payload abstraction
    const checkoutSessionPayload = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `VerifyFlow ${tierKey} Tier`,
              description: `${priceDetails.MONTHLY_VERIFICATIONS.toLocaleString()} Monthly Verifications, ${priceDetails.RATE_LIMIT_PER_MIN} req/min rate limit`
            },
            unit_amount: priceDetails.PRICE_USD * 100 // Amount in cents
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/billing?canceled=true`,
      client_reference_id: userId.toString(),
      customer_email: user.email,
      metadata: {
        userId: userId.toString(),
        tier: tierKey
      }
    };

    logger.info(`[STRIPE BILLING] Checkout Session Created for User ${user.email} (${tierKey} Tier)`);

    return {
      sessionUrl: checkoutSessionPayload.success_url, // Ready for Stripe redirect in production
      checkoutSessionPayload
    };
  }

  /**
   * Handle Stripe Webhook Events
   */
  static async handleStripeWebhook(event) {
    logger.info(`[STRIPE WEBHOOK] Received event type: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId || session.client_reference_id;
        const tier = session.metadata?.tier || 'STARTER';

        if (userId) {
          await this.updatePlan(userId, tier);
          await Subscription.updateOne(
            { userId },
            {
              stripeCustomerId: session.customer || '',
              stripeSubscriptionId: session.subscription || ''
            }
          );
          logger.info(`[STRIPE WEBHOOK] Plan upgraded to ${tier} for user ${userId}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const subscription = await Subscription.findOne({ stripeCustomerId: customerId });

        if (subscription) {
          subscription.usedQuota = 0; // Reset monthly quota upon successful billing cycle payment
          subscription.quotaResetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          subscription.status = 'ACTIVE';
          await subscription.save();
          logger.info(`[STRIPE WEBHOOK] Quota reset for customer ${customerId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const customerId = sub.customer;
        const subscription = await Subscription.findOne({ stripeCustomerId: customerId });

        if (subscription) {
          await this.updatePlan(subscription.userId, 'FREE');
          subscription.status = 'CANCELLED';
          await subscription.save();
          logger.info(`[STRIPE WEBHOOK] Subscription cancelled for customer ${customerId}, reverted to FREE tier.`);
        }
        break;
      }

      default:
        logger.info(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
