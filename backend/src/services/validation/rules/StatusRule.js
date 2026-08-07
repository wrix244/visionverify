import { BaseValidationRule } from '../BaseValidationRule.js';

export class StatusRule extends BaseValidationRule {
  constructor() {
    super('Transaction Status Check', 'STATUS');
  }

  evaluate({ ocrData }) {
    const status = (ocrData?.status || 'SUCCESS').toUpperCase();

    if (status === 'SUCCESS' || status === 'AUTHENTIC' || status === 'PAID') {
      return this.createPassedCheck('Transaction status is confirmed SUCCESSFUL.', 100);
    }

    if (status === 'PENDING' || status === 'PROCESSING') {
      return this.createFailedCheck(
        'Transaction status is PENDING or PROCESSING. Funds have not reached payee.',
        'HIGH',
        'Extracted Transaction Status: PENDING',
        25
      );
    }

    return this.createFailedCheck(
      `Transaction status is ${status}. Payment was not completed.`,
      'CRITICAL',
      `Extracted Transaction Status: ${status}`,
      40
    );
  }
}
