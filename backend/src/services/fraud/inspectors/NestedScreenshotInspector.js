import { BaseFraudInspector } from '../BaseFraudInspector.js';

export class NestedScreenshotInspector extends BaseFraudInspector {
  constructor() {
    super('Nested Frame & Screenshot Inspector', 'NESTED_SCREENSHOT_DETECTED');
  }

  inspect({ rawText }) {
    // Detect double clock/battery status bars or inner device frame borders
    const clockMatches = (rawText.match(/[0-9]{1,2}:[0-9]{2}\s*(?:AM|PM)?/gi) || []).length;
    if (clockMatches > 2) {
      return this.createRiskFlag(
        'Nested screenshot artifact detected (multiple device status bars or nested frame borders).',
        'MEDIUM',
        25,
        8,
        { clockMatches }
      );
    }

    return null;
  }
}
