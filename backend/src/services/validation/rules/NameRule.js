import { BaseValidationRule } from '../BaseValidationRule.js';

export class NameRule extends BaseValidationRule {
  constructor() {
    super('Name Fuzzy Match Check', 'NAME');
  }

  evaluate({ ocrData, expectedData }) {
    const ocrName = (ocrData?.name || ocrData?.payeeName || '').trim();
    const expectedName = (expectedData?.expectedMerchantName || expectedData?.expectedName || '').trim();

    if (!expectedName) {
      return this.createPassedCheck('No expected merchant name provided for validation.', 100);
    }

    if (!ocrName) {
      return this.createFailedCheck(
        'Payee name missing from extracted screenshot text.',
        'MEDIUM',
        `Expected Name: '${expectedName}', Extracted Name: Missing`,
        15
      );
    }

    const normOcr = ocrName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normExp = expectedName.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (normOcr === normExp || normOcr.includes(normExp) || normExp.includes(normOcr)) {
      return this.createPassedCheck(
        `Extracted name '${ocrName}' matches merchant expected name '${expectedName}'.`,
        98
      );
    }

    return this.createFailedCheck(
      `Name mismatch. Extracted '${ocrName}' does not match expected '${expectedName}'.`,
      'HIGH',
      `Expected Name: '${expectedName}', Extracted Name: '${ocrName}'`,
      25
    );
  }
}
