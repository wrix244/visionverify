import { BaseFraudInspector } from '../BaseFraudInspector.js';

export class PhotoshopEditsInspector extends BaseFraudInspector {
  constructor() {
    super('Photoshop & Editing Software Inspector', 'PHOTOSHOP_EDIT_DETECTED');
  }

  inspect({ fileBuffer, metadata, rawText }) {
    const rawBufferStr = fileBuffer.toString('binary');
    const editingSoftwareKeywords = [
      'Photoshop', 'Adobe', 'GIMP', 'Canva', 'PicsArt', 'Snapseed',
      'Pixlr', 'Lightroom', 'Pixelmator', 'Affinity Photo'
    ];

    let detectedSoftware = null;
    for (const kw of editingSoftwareKeywords) {
      if (rawBufferStr.includes(kw)) {
        detectedSoftware = kw;
        break;
      }
    }

    if (detectedSoftware) {
      return this.createRiskFlag(
        `Digital editing software trace detected in image metadata (${detectedSoftware}). Screenshot appears edited.`,
        'CRITICAL',
        45, // High fraud score contribution
        15,
        { softwareDetected: detectedSoftware }
      );
    }

    return null;
  }
}
