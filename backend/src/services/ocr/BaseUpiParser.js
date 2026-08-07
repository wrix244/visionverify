/**
 * Abstract Base Class for all UPI App Screenshot Parsers.
 * Implement this class to add support for new payment apps (Strategy Pattern).
 */
export class BaseUpiParser {
  constructor(appName) {
    if (this.constructor === BaseUpiParser) {
      throw new Error('BaseUpiParser is an abstract class and cannot be instantiated directly.');
    }
    this.appName = appName;
  }

  /**
   * Evaluates if this parser can handle the provided OCR text.
   * @param {string} text Raw OCR text extracted from screenshot
   * @returns {number} Score from 0 to 100 indicating match confidence
   */
  canParse(text) {
    throw new Error('canParse(text) must be implemented by subclass.');
  }

  /**
   * Parses raw OCR text into structured JSON payment details.
   * @param {string} text Raw OCR text
   * @returns {Object} Extracted structured data payload
   */
  parse(text) {
    throw new Error('parse(text) must be implemented by subclass.');
  }

  /**
   * Helper: Universal 12-digit UTR Extractor
   */
  extractUtr(text) {
    // Search for 12-digit UTR numbers (e.g. 405912839401, UTR: 405912839401, Ref No: 405912839401)
    const utrRegexes = [
      /(?:UTR|Ref|Reference|Txn|Transaction)\s*(?:No|ID|Num|Number)?[:\s-]*([0-9]{12})/i,
      /\b([0-9]{12})\b/
    ];

    for (const regex of utrRegexes) {
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Helper: Universal Amount Extractor
   */
  extractAmount(text) {
    // Search for currency amounts (e.g. ₹ 2,500.00, Rs. 1500, INR 500)
    const amountRegexes = [
      /(?:₹|Rs\.?|INR)\s*([0-9,]+(?:\.[0-9]{2})?)/i,
      /\b([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)\b/
    ];

    for (const regex of amountRegexes) {
      const match = text.match(regex);
      if (match && match[1]) {
        const numericStr = match[1].replace(/,/g, '');
        const val = parseFloat(numericStr);
        if (!isNaN(val) && val > 0 && val < 1000000) {
          return val;
        }
      }
    }

    return null;
  }

  /**
   * Helper: Universal Bank Name Extractor
   */
  extractBank(text) {
    const commonBanks = [
      'HDFC Bank', 'State Bank of India', 'SBI', 'ICICI Bank', 'Axis Bank',
      'Kotak Mahindra Bank', 'Kotak', 'Bank of Baroda', 'Punjab National Bank',
      'PNB', 'Union Bank', 'Canara Bank', 'IDFC FIRST Bank', 'IndusInd Bank',
      'Paytm Payments Bank', 'Airtel Payments Bank', 'Federal Bank', 'YES Bank'
    ];

    for (const bank of commonBanks) {
      const regex = new RegExp(`\\b${bank}\\b`, 'i');
      if (regex.test(text)) {
        return bank;
      }
    }

    return 'Unknown Bank';
  }

  /**
   * Helper: Universal Status Extractor
   */
  extractStatus(text) {
    if (/(?:Successful|Paid|Completed|Success|Sent|Transferred)/i.test(text)) {
      return 'SUCCESS';
    }
    if (/(?:Pending|Processing|Initiated)/i.test(text)) {
      return 'PENDING';
    }
    if (/(?:Failed|Declined|Rejected|Cancelled)/i.test(text)) {
      return 'FAILED';
    }
    return 'SUCCESS'; // Default for completed screenshots
  }

  /**
   * Helper: Universal Transaction Time Extractor
   */
  extractTransactionTime(text) {
    // Match common date patterns (e.g. 03 Aug 2026, 03/08/2026, 01:15 PM)
    const timeRegex = /([0-9]{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+[0-9]{4}(?:,?\s+[0-9]{1,2}:[0-9]{2}\s*(?:AM|PM)?)?)/i;
    const match = text.match(timeRegex);
    if (match && match[1]) {
      return match[1];
    }
    return new Date().toISOString();
  }
}
