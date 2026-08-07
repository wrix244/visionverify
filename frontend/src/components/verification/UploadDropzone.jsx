import React, { useState } from 'react';
import { UploadCloud, File, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const UploadDropzone = ({ onUpload, isLoading }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showExpectedParams, setShowExpectedParams] = useState(false);
  const [expectedAmount, setExpectedAmount] = useState('');
  const [expectedUpiId, setExpectedUpiId] = useState('');
  const [expectedMerchantName, setExpectedMerchantName] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a valid image (PNG, JPEG, WEBP)');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit');
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('proof', file);
    if (expectedAmount) formData.append('expectedAmount', expectedAmount);
    if (expectedUpiId) formData.append('expectedUpiId', expectedUpiId);
    if (expectedMerchantName) formData.append('expectedMerchantName', expectedMerchantName);

    onUpload(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* File Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors relative ${
          dragActive
            ? 'border-brand-500 bg-brand-600/10'
            : file
            ? 'border-emerald-500/40 bg-emerald-500/5'
            : 'border-surface-800 bg-surface-900/50 hover:border-surface-700'
        }`}
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {file ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
              <File className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-surface-100">{file.name}</span>
            <span className="text-[10px] text-surface-400 font-mono">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-full bg-brand-600/10 text-brand-400">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-xs font-semibold text-surface-200">
              <span className="text-brand-400 font-bold">Click to upload</span> or drag and drop payment proof
            </p>
            <span className="text-[10px] text-surface-400">PNG, JPEG, WEBP up to 10MB</span>
          </div>
        )}
      </div>

      {/* Optional Expected Reconciliation Parameters Accordion */}
      <div className="border border-surface-800 rounded-lg p-3 bg-surface-900/40">
        <button
          type="button"
          onClick={() => setShowExpectedParams(!showExpectedParams)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-surface-400 hover:text-surface-200 transition-colors"
        >
          <span>Expected Reconciliation Parameters (Optional)</span>
          {showExpectedParams ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showExpectedParams && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-surface-800">
            <Input
              label="Expected Amount (₹)"
              placeholder="e.g. 2500"
              value={expectedAmount}
              onChange={(e) => setExpectedAmount(e.target.value)}
            />
            <Input
              label="Merchant UPI ID"
              placeholder="e.g. merchant@upi"
              value={expectedUpiId}
              onChange={(e) => setExpectedUpiId(e.target.value)}
            />
            <Input
              label="Expected Payee Name"
              placeholder="e.g. Acme Pay Solutions"
              value={expectedMerchantName}
              onChange={(e) => setExpectedMerchantName(e.target.value)}
            />
          </div>
        )}
      </div>

      <Button type="submit" isLoading={isLoading} disabled={!file} className="w-full">
        Run Verification Pipeline
      </Button>
    </form>
  );
};
