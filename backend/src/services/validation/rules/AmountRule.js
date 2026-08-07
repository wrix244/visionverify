import { BaseValidationRule } from '../BaseValidationRule.js';

export class AmountRule extends BaseValidationRule {
  constructor() {
    super('Amount Matching Check', 'AMOUNT');
  }

  evaluate({ ocrData, expectedData }) {
    const ocrAmount = parseFloat(ocrData?.amount);
    const expectedAmount = parseFloat(expectedData?.expectedAmount);

    if (isNaN(expectedAmount)) {
      return this.createPassedCheck('No merchant expected amount specified for validation.', 100);
    }

    if (isNaN(ocrAmount)) {
      return this.createFailedCheck(
        'Failed to extract payment amount from screenshot.',
        'CRITICAL',
        `Expected ₹${expectedAmount.toFixed(2)}, Extracted Amount is UNKNOWN`,
        30
      );
    }

    const difference = Math.abs(ocrAmount - expectedAmount);

    if (difference < 0.01) {
      return this.createPassedCheck(
        `Payment amount matches expected amount exactly (₹${expectedAmount.toFixed(2)}).`,
        100,
        { ocrAmount, expectedAmount }
      );
    }

    const isShortfall = ocrAmount < expectedAmount;
    const diffAmount = Math.abs(expectedAmount - ocrAmount).toFixed(2);

    return this.createFailedCheck(
      `Amount mismatch detected. ${isShortfall ? 'Shortfall' : 'Surplus'} of ₹${diffAmount}.`,
      isShortfall ? 'CRITICAL' : 'HIGH',
      `Expected ₹${expectedAmount.toFixed(2)}, Extracted ₹${ocrAmount.toFixed(2)} (${isShortfall ? 'Shortfall' : 'Surplus'}: ₹${diffAmount})`,
      35,
      { ocrAmount, expectedAmount, diffAmount }
    );
  }
}
