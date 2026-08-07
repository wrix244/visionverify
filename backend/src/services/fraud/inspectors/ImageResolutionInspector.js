import { BaseFraudInspector } from '../BaseFraudInspector.js';

export class ImageResolutionInspector extends BaseFraudInspector {
  constructor() {
    super('Image Resolution & Pixelation Inspector', 'LOW_RESOLUTION_DETECTED');
  }

  inspect({ fileBuffer }) {
    const sizeInBytes = fileBuffer.length;
    // Ultra low file sizes (< 15KB) indicate heavy downsampling to obscure editing artifacts
    if (sizeInBytes < 15 * 1024) {
      return this.createRiskFlag(
        'Low resolution screenshot detected (< 15KB). Downscaling may be used to obscure forgery artifacts.',
        'MEDIUM',
        25,
        10,
        { fileSizeBytes: sizeInBytes }
      );
    }

    return null;
  }
}
