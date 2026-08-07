import { BaseValidationRule } from '../BaseValidationRule.js';

export class RecipientRule extends BaseValidationRule {
  constructor() {
    super('Recipient Entity Check', 'RECIPIENT');
  }

  evaluate({ ocrData, expectedData }) {
    const ocrRecipient = ocrData?.payeeName || ocrData?.name || '';
    const expectedRecipient = expectedData?.expectedRecipient || expectedData?.expectedMerchantName || '';

    if (!expectedRecipient) {
      return this.createPassedCheck('No expected recipient specified.', 100);
    }

    if (!ocrRecipient) {
      return this.createFailedCheck(
        'Payee recipient name missing from extracted screenshot text.',
        'MEDIUM',
        `Expected Recipient: '${expectedRecipient}', Extracted Recipient: Missing`,
        15
      );
    }

    const normOcr = ocrRecipient.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normExp = expectedRecipient.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (normOcr.includes(normExp) || normExp.includes(normOcr)) {
      return this.createPassedCheck(
        `Recipient entity '${ocrRecipient}' matches merchant expected recipient '${expectedRecipient}'.`,
        98
      );
    }

    return this.createFailedCheck(
      `Recipient mismatch. Screenshot indicates payment to '${ocrRecipient}'.`,
      'HIGH',
      `Expected Recipient: '${expectedRecipient}', Extracted Recipient: '${ocrRecipient}'`,
      25
    );
  }
}
