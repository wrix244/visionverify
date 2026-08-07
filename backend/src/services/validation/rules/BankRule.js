import { BaseValidationRule } from '../BaseValidationRule.js';

export class BankRule extends BaseValidationRule {
  constructor() {
    super('Bank Name Consistency Check', 'BANK');
  }

  evaluate({ ocrData, expectedData }) {
    const ocrBank = ocrData?.bank || 'Unknown Bank';
    const expectedBank = expectedData?.expectedBank;

    if (!expectedBank) {
      return this.createPassedCheck(`Extracted Bank: '${ocrBank}'. Bank name consistency check passed.`, 95);
    }

    const normOcr = ocrBank.toLowerCase();
    const normExp = expectedBank.toLowerCase();

    if (normOcr.includes(normExp) || normExp.includes(normOcr)) {
      return this.createPassedCheck(
        `Extracted bank '${ocrBank}' matches expected bank '${expectedBank}'.`,
        100
      );
    }

    return this.createFailedCheck(
      `Bank mismatch. Extracted '${ocrBank}', expected '${expectedBank}'.`,
      'LOW',
      `Expected Bank: '${expectedBank}', Extracted Bank: '${ocrBank}'`,
      10
    );
  }
}
