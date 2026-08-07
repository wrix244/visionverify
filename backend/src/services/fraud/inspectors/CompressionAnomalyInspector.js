import { BaseFraudInspector } from '../BaseFraudInspector.js';

export class CompressionAnomalyInspector extends BaseFraudInspector {
  constructor() {
    super('Compression Artifact Anomaly Inspector', 'COMPRESSION_ANOMALY_DETECTED');
  }

  inspect({ fileBuffer }) {
    // Check for double JPEG compression artifacts (e.g. saving an edited PNG as JPEG repeatedly)
    const rawBufferStr = fileBuffer.toString('binary');
    const jpegHeaderCount = (rawBufferStr.match(/\xFF\xD8\xFF/g) || []).length;

    if (jpegHeaderCount > 1) {
      return this.createRiskFlag(
        'Double JPEG compression anomaly detected. Indicates multiple re-saves after image modification.',
        'HIGH',
        30,
        10,
        { jpegHeaderCount }
      );
    }

    return null;
  }
}
