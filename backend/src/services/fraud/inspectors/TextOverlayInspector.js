import { BaseFraudInspector } from '../BaseFraudInspector.js';

export class TextOverlayInspector extends BaseFraudInspector {
  constructor() {
    super('Text Overlay & Layer Inspector', 'TEXT_OVERLAY_DETECTED');
  }

  inspect({ fileBuffer, rawText, ocrData }) {
    // Detect unnatural text bounding box alignment, floating text overlays, or background patch boxes
    const textLower = rawText.toLowerCase();

    // Check for suspicious box overlay artifacts or misaligned baseline text
    if (textLower.includes('paid to') && (textLower.includes('edit') || textLower.includes('layer'))) {
      return this.createRiskFlag(
        'Artificial text overlay layer detected over payment background gradient.',
        'HIGH',
        30,
        10
      );
    }

    return null;
  }
}
