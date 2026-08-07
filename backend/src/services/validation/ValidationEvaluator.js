export class ValidationEvaluator {
  /**
   * Aggregate 7 validation check results into structured reconciliation report
   * @param {Array} ruleResults Results from executing all 7 validation rules
   * @returns {Object} Final reconciliation payload
   */
  static evaluate(ruleResults = []) {
    const passedChecks = [];
    const failedChecks = [];
    let totalConfidencePenalty = 0;

    ruleResults.forEach(res => {
      if (res.passed) {
        passedChecks.push(res);
      } else {
        failedChecks.push(res);
        totalConfidencePenalty += res.confidencePenalty || 20;
      }
    });

    const baseConfidence = 100;
    const confidenceScore = Math.max(0, Math.min(100, Math.round(baseConfidence - totalConfidencePenalty)));

    let validationStatus = 'PASSED';
    let isValidationSuccessful = true;

    // Check if Amount or Critical Checks Failed
    const hasCriticalFailure = failedChecks.some(f => f.severity === 'CRITICAL');
    const hasHighFailure = failedChecks.some(f => f.severity === 'HIGH');

    if (hasCriticalFailure) {
      validationStatus = 'FAILED';
      isValidationSuccessful = false;
    } else if (hasHighFailure || failedChecks.length >= 2) {
      validationStatus = 'PARTIAL_MATCH';
      isValidationSuccessful = false;
    }

    return {
      passedChecks,
      failedChecks,
      confidenceScore,
      validationStatus, // 'PASSED' | 'PARTIAL_MATCH' | 'FAILED'
      isValidationSuccessful,
      passedCount: passedChecks.length,
      failedCount: failedChecks.length,
      totalChecksEvaluated: ruleResults.length
    };
  }
}
