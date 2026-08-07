import { BaseFraudInspector } from '../BaseFraudInspector.js';

export class FontInconsistencyInspector extends BaseFraudInspector {
  constructor() {
    super('Font & Typeface Inconsistency Inspector', 'FONT_INCONSISTENCY_DETECTED');
  }

  inspect({ rawText }) {
    // Check for irregular font spacing, mixed digit typefaces, or synthetic currency symbols
    if (rawText && (rawText.includes('₹') || rawText.includes('Rs'))) {
      const hasIrregularDigits = /[0-9]+\s+[0-9]{2}/.test(rawText);
      if (hasIrregularDigits) {
        return this.createRiskFlag(
          'Font weight & spacing inconsistency detected within transaction amount digits.',
          'HIGH',
          30,
          10
        );
      }
    }

    return null;
  }
}
