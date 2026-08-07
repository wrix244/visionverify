import { GooglePayParser } from './parsers/GooglePayParser.js';
import { PhonePeParser } from './parsers/PhonePeParser.js';
import { PaytmParser } from './parsers/PaytmParser.js';
import { BHIMParser } from './parsers/BHIMParser.js';
import { AmazonPayParser } from './parsers/AmazonPayParser.js';
import { GenericUpiParser } from './parsers/GenericUpiParser.js';

export class UpiParserRegistry {
  constructor() {
    this.parsers = [];
    this.initDefaultParsers();
  }

  initDefaultParsers() {
    // Register supported UPI Payment App Parsers (Strategy Pattern)
    this.registerParser(new GooglePayParser());
    this.registerParser(new PhonePeParser());
    this.registerParser(new PaytmParser());
    this.registerParser(new BHIMParser());
    this.registerParser(new AmazonPayParser());
    this.registerParser(new GenericUpiParser()); // Fallback parser
  }

  /**
   * Register a new Payment App Parser
   * Allows scaling to 100+ payment apps seamlessly without modifying core engine logic
   */
  registerParser(parserInstance) {
    this.parsers.push(parserInstance);
  }

  /**
   * Selects the best parser matching the OCR raw text
   */
  selectParser(text) {
    let bestParser = null;
    let highestScore = -1;

    for (const parser of this.parsers) {
      const score = parser.canParse(text);
      if (score > highestScore) {
        highestScore = score;
        bestParser = parser;
      }
    }

    return bestParser || new GenericUpiParser();
  }
}

// Export singleton instance
export const upiParserRegistry = new UpiParserRegistry();
