import { BaseValidationRule } from '../BaseValidationRule.js';

export class UpiIdRule extends BaseValidationRule {
  constructor() {
    super('UPI ID Check', 'UPI_ID');
  }

  evaluate({ ocrData, expectedData }) {
    const ocrUpiId = (ocrData?.payeeUpiId || ocrData?.upiId || '').toLowerCase().trim();
    const expectedUpiId = (expectedData?.expectedUpiId || '').toLowerCase().trim();

    if (!expectedUpiId) {
      return this.createPassedCheck('No merchant expected UPI ID provided for validation.', 100);
    }

    if (!ocrUpiId) {
      return this.createFailedCheck(
        'Payee UPI ID missing from screenshot text.',
        'HIGH',
        `Expected UPI ID: '${expectedUpiId}', Extracted UPI ID: Missing`,
        20
      );
    }

    if (ocrUpiId === expectedUpiId || ocrUpiId.includes(expectedUpiId) || expectedUpiId.includes(ocrUpiId)) {
      return this.createPassedCheck(
        `Payee UPI ID '${ocrUpiId}' matches expected merchant UPI ID '${expectedUpiId}'.`,
        100
      );
    }

    return this.createFailedCheck(
      `UPI ID mismatch. Payment was sent to '${ocrUpiId}'.`,
      'CRITICAL',
      `Expected UPI ID: '${expectedUpiId}', Extracted UPI ID: '${ocrUpiId}'`,
      30
    );
  }
}
