/**
 * Abstract Base Class for Validation Rules (Strategy Pattern).
 */
export class BaseValidationRule {
  constructor(ruleName, checkKey) {
    if (this.constructor === BaseValidationRule) {
      throw new Error('BaseValidationRule is an abstract class and cannot be instantiated directly.');
    }
    this.ruleName = ruleName;
    this.checkKey = checkKey;
  }

  /**
   * Execute validation check comparing extracted OCR data against merchant expectations.
   * @param {Object} params { ocrData, expectedData }
   * @returns {Object} Validation check result payload
   */
  evaluate(params) {
    throw new Error('evaluate(params) must be implemented by subclass.');
  }

  /**
   * Helper to format a Passed Check object
   */
  createPassedCheck(message, confidence = 100, details = {}) {
    return {
      checkName: this.ruleName,
      checkKey: this.checkKey,
      passed: true,
      message,
      confidence,
      details
    };
  }

  /**
   * Helper to format a Failed Check object
   */
  createFailedCheck(message, severity = 'HIGH', discrepancy = '', confidencePenalty = 20, details = {}) {
    return {
      checkName: this.ruleName,
      checkKey: this.checkKey,
      passed: false,
      message,
      severity, // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      discrepancy,
      confidencePenalty,
      details
    };
  }
}
