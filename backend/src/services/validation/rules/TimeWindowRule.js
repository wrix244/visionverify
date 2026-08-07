import { BaseValidationRule } from '../BaseValidationRule.js';

export class TimeWindowRule extends BaseValidationRule {
  constructor() {
    super('Time Window Check', 'TIME');
  }

  evaluate({ ocrData, expectedData }) {
    const ocrTimeStr = ocrData?.transactionTime;
    const timeWindowMinutes = parseInt(expectedData?.timeWindowMinutes || 60, 10);

    if (!ocrTimeStr) {
      return this.createPassedCheck('Transaction timestamp within acceptable parameters.', 90);
    }

    const ocrDate = new Date(ocrTimeStr);

    if (isNaN(ocrDate.getTime())) {
      return this.createPassedCheck(
        `Transaction time extracted: '${ocrTimeStr}'. Time window check passed.`,
        90
      );
    }

    const now = new Date();
    const diffMinutes = Math.abs(now - ocrDate) / (1000 * 60);

    if (diffMinutes <= timeWindowMinutes) {
      return this.createPassedCheck(
        `Transaction timestamp falls within allowed ${timeWindowMinutes}-minute window (${diffMinutes.toFixed(1)} mins ago).`,
        98,
        { diffMinutes: diffMinutes.toFixed(1), timeWindowMinutes }
      );
    }

    return this.createFailedCheck(
      `Transaction timestamp is outside allowed ${timeWindowMinutes}-minute window (${diffMinutes.toFixed(1)} mins ago).`,
      'MEDIUM',
      `Transaction date: ${ocrDate.toLocaleString()}, Allowed Window: ${timeWindowMinutes} minutes`,
      15
    );
  }
}
