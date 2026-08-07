import { BaseFraudInspector } from '../BaseFraudInspector.js';

export class ValueBlurInspector extends BaseFraudInspector {
  constructor() {
    super('Selective Blurring Inspector', 'BLURRED_VALUE_DETECTED');
  }

  inspect({ rawText }) {
    // Detect if amount or UTR numbers contain unreadable blurred character fragments
    if (rawText && (rawText.includes('???') || rawText.includes('---'))) {
      return this.createRiskFlag(
        'Selective gaussian blur detected over payment amount or UTR text area.',
        'HIGH',
        35,
        12
      );
    }

    return null;
  }
}
