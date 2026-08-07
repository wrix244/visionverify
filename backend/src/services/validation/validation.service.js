import { AmountRule } from './rules/AmountRule.js';
import { RecipientRule } from './rules/RecipientRule.js';
import { UpiIdRule } from './rules/UpiIdRule.js';
import { TimeWindowRule } from './rules/TimeWindowRule.js';
import { StatusRule } from './rules/StatusRule.js';
import { NameRule } from './rules/NameRule.js';
import { BankRule } from './rules/BankRule.js';
import { ValidationEvaluator } from './ValidationEvaluator.js';
import { ApiError } from '../../utils/ApiError.js';
import { HTTP_STATUS } from '../../config/constants.js';

export class ValidationEngineService {
  constructor() {
    // Register 7 Explicit Validation Rule Strategy Modules
    this.rules = [
      new AmountRule(),
      new RecipientRule(),
      new UpiIdRule(),
      new TimeWindowRule(),
      new StatusRule(),
      new NameRule(),
      new BankRule()
    ];
  }

  /**
   * Run 7-point validation check against merchant expected parameters
   * @param {Object} params { ocrData, expectedData }
   * @returns {Object} Structured reconciliation report
   */
  async validatePaymentData(ocrData, expectedData = {}) {
    if (!ocrData) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'ocrData payload is required for validation');
    }

    const startTime = Date.now();

    // Execute all 7 Validation Rules
    const ruleResults = this.rules.map(rule => {
      return rule.evaluate({ ocrData, expectedData });
    });

    // Aggregate into structured reconciliation report
    const evaluation = ValidationEvaluator.evaluate(ruleResults);
    const processingTimeMs = Date.now() - startTime;

    return {
      success: true,
      data: {
        passedChecks: evaluation.passedChecks,
        failedChecks: evaluation.failedChecks,
        confidenceScore: evaluation.confidenceScore,
        validationStatus: evaluation.validationStatus,
        isValidationSuccessful: evaluation.isValidationSuccessful,
        passedCount: evaluation.passedCount,
        failedCount: evaluation.failedCount,
        totalChecks: evaluation.totalChecksEvaluated,
        processingTimeMs
      }
    };
  }
}

// Export singleton instance
export const validationEngineService = new ValidationEngineService();
