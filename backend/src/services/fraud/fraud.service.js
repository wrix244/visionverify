import { PhotoshopEditsInspector } from './inspectors/PhotoshopEditsInspector.js';
import { TextOverlayInspector } from './inspectors/TextOverlayInspector.js';
import { ClonedRegionInspector } from './inspectors/ClonedRegionInspector.js';
import { AspectRatioCroppingInspector } from './inspectors/AspectRatioCroppingInspector.js';
import { ImageResolutionInspector } from './inspectors/ImageResolutionInspector.js';
import { CompressionAnomalyInspector } from './inspectors/CompressionAnomalyInspector.js';
import { FontInconsistencyInspector } from './inspectors/FontInconsistencyInspector.js';
import { ValueBlurInspector } from './inspectors/ValueBlurInspector.js';
import { NestedScreenshotInspector } from './inspectors/NestedScreenshotInspector.js';
import { FraudScorer } from './FraudScorer.js';
import { OcrEngineService } from '../ocr/ocr.service.js';
import { logger } from '../../utils/logger.js';
import { ApiError } from '../../utils/ApiError.js';
import { HTTP_STATUS } from '../../config/constants.js';

export class FraudEngineService {
  constructor() {
    // Register all 9 Fraud Inspection Strategy Modules
    this.inspectors = [
      new PhotoshopEditsInspector(),
      new TextOverlayInspector(),
      new ClonedRegionInspector(),
      new AspectRatioCroppingInspector(),
      new ImageResolutionInspector(),
      new CompressionAnomalyInspector(),
      new FontInconsistencyInspector(),
      new ValueBlurInspector(),
      new NestedScreenshotInspector()
    ];
  }

  /**
   * Run full Fraud Inspection Engine on Payment Screenshot
   * @param {Buffer} fileBuffer Image file buffer
   * @returns {Object} Structured Fraud Analysis JSON Report
   */
  async analyzeScreenshot(fileBuffer) {
    if (!fileBuffer) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Image buffer required for fraud inspection');
    }

    const startTime = Date.now();

    // 1. Run OCR engine to obtain raw text context
    let ocrResult = { data: { rawText: '' } };
    try {
      ocrResult = await OcrEngineService.processImage(fileBuffer);
    } catch (e) {
      logger.warn('[FRAUD ENGINE] OCR step failed during fraud inspection, proceeding with raw image checks');
    }

    const rawText = ocrResult?.data?.rawText || '';

    // 2. Execute all 9 Inspection Strategy Modules
    const riskFlags = [];
    for (const inspector of this.inspectors) {
      try {
        const flag = inspector.inspect({ fileBuffer, rawText, ocrData: ocrResult.data });
        if (flag) {
          riskFlags.push(flag);
        }
      } catch (err) {
        logger.error(`[FRAUD ENGINE] Inspector ${inspector.name} error:`, err);
      }
    }

    // 3. Compute Fraud Score, Confidence Score & Risk Tier
    const assessment = FraudScorer.evaluate(riskFlags);
    const processingTimeMs = Date.now() - startTime;

    return {
      success: true,
      data: {
        fraudScore: assessment.fraudScore, // 0% = Authentic, 100% = Tampered Fraud
        confidenceScore: assessment.confidenceScore,
        riskTier: assessment.riskTier, // 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK'
        recommendation: assessment.recommendation, // 'ACCEPT' | 'MANUAL_REVIEW' | 'REJECT'
        isAuthentic: assessment.isAuthentic,
        anomaliesCount: assessment.totalAnomaliesDetected,
        riskFlags: assessment.riskFlags,
        extractedOcrData: {
          amount: ocrResult.data?.amount,
          utr: ocrResult.data?.utr,
          upiApp: ocrResult.data?.upiApp,
          bank: ocrResult.data?.bank
        },
        processingTimeMs
      }
    };
  }
}

// Export singleton instance
export const fraudEngineService = new FraudEngineService();
