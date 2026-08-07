/**
 * Abstract Base Class for Fraud Inspector Modules (Strategy Pattern).
 */
export class BaseFraudInspector {
  constructor(name, code) {
    if (this.constructor === BaseFraudInspector) {
      throw new Error('BaseFraudInspector is an abstract class and cannot be instantiated directly.');
    }
    this.name = name;
    this.code = code;
  }

  /**
   * Inspect image properties & text layout for visual tampering anomalies.
   * @param {Object} params Inspection parameters (fileBuffer, metadata, ocrData)
   * @returns {Object|null} Risk flag object if anomaly detected, or null if authentic
   */
  inspect(params) {
    throw new Error('inspect(params) must be implemented by subclass.');
  }

  /**
   * Helper to format a standard Risk Flag payload
   */
  createRiskFlag(message, severity, fraudScoreContribution, confidencePenalty = 5, details = {}) {
    return {
      code: this.code,
      name: this.name,
      message,
      severity, // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      fraudScoreContribution, // 0 to 100
      confidencePenalty,
      details
    };
  }
}
