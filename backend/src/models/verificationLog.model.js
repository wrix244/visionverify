import mongoose from 'mongoose';
import { VERIFICATION_STATUS } from '../config/constants.js';

const verificationLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApiKey',
      default: null,
      index: true
    },
    utrNumber: {
      type: String,
      default: '',
      index: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    cloudinaryPublicId: {
      type: String,
      default: ''
    },
    // Master Verdict & Master Confidence
    status: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.AUTHENTIC,
      index: true
    },
    confidenceScore: {
      type: Number,
      default: 95.0
    },
    // Extracted OCR Data
    extractedData: {
      amount: { type: Number, default: 0 },
      payeeName: { type: String, default: '' },
      payeeUpiId: { type: String, default: '' },
      payerName: { type: String, default: '' },
      bank: { type: String, default: '' },
      transactionTimestamp: { type: Date, default: null },
      status: { type: String, default: 'SUCCESS' },
      appDetected: { type: String, default: 'Generic UPI' }
    },
    // Fraud Detection Engine Report
    fraudAnalysis: {
      fraudScore: { type: Number, default: 0 },
      riskTier: { type: String, default: 'LOW_RISK' },
      anomaliesCount: { type: Number, default: 0 },
      riskFlags: { type: Array, default: [] }
    },
    // Validation Reconciliation Engine Report
    validationReport: {
      validationStatus: { type: String, default: 'PASSED' },
      confidenceScore: { type: Number, default: 100 },
      passedChecks: { type: Array, default: [] },
      failedChecks: { type: Array, default: [] }
    },
    // Merchant Expected Parameters
    expectedParameters: {
      expectedAmount: { type: Number, default: null },
      expectedUpiId: { type: String, default: '' },
      expectedMerchantName: { type: String, default: '' },
      timeWindowMinutes: { type: Number, default: 60 }
    },
    processingTimeMs: {
      type: Number,
      default: 0
    },
    source: {
      type: String,
      enum: ['DASHBOARD', 'API'],
      default: 'DASHBOARD'
    }
  },
  {
    timestamps: true
  }
);

export const VerificationLog = mongoose.model('VerificationLog', verificationLogSchema);
