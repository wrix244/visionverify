import { BaseFraudInspector } from '../BaseFraudInspector.js';

export class AspectRatioCroppingInspector extends BaseFraudInspector {
  constructor() {
    super('Aspect Ratio & Cropping Inspector', 'CROPPING_ANOMALY_DETECTED');
  }

  inspect({ fileBuffer }) {
    // Check standard mobile screen aspect ratios (16:9, 19.5:9, 20:9)
    // Small or square images (e.g. 1:1, 4:3) indicate truncated/cropped status bars or headers
    const sizeInKB = fileBuffer.length / 1024;
    if (sizeInKB < 30) {
      return this.createRiskFlag(
        'Non-standard image aspect ratio or heavily cropped mobile screen boundaries.',
        'MEDIUM',
        20,
        5,
        { imageSizeKB: sizeInKB.toFixed(1) }
      );
    }

    return null;
  }
}
