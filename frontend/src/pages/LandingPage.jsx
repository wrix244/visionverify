import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Key, ArrowRight, CheckCircle2, Copy, Check, Terminal, Lock, Cpu } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';

export const LandingPage = () => {
  const [copied, setCopied] = useState(false);

  const sampleCode = `curl -X POST https://api.verifyflow.io/v1/verifications/upload \\
  -H "x-api-key: sk_live_9f8a7b6c5d4e..." \\
  -F "proof=@payment_screenshot.png" \\
  -F "expectedAmount=2500"`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 flex flex-col selection:bg-brand-600 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden border-b border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>Razorpay-grade Payment Proof Validation Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-surface-50 leading-tight">
              Automated UPI Payment Verification & Fraud Prevention
            </h1>

            <p className="mt-4 text-base sm:text-lg text-surface-300 max-w-2xl mx-auto font-normal">
              Validate customer UPI payment screenshots & UTR references in sub-milliseconds. Detect Photoshop edits, cloned text, and invalid amounts automatically.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto px-6">
                  Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6">
                  Live Merchant Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Minimal Code Snippet Box */}
          <div className="mt-14 max-w-3xl mx-auto">
            <div className="code-block rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800 text-xs text-surface-400">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-brand-400" />
                  <span className="font-mono text-surface-200">cURL API Integration Example</span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center space-x-1 text-surface-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs text-brand-300 font-mono overflow-x-auto leading-relaxed">
                {sampleCode}
              </pre>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="razor-card p-5">
              <div className="p-2 rounded bg-brand-600/10 text-brand-400 w-fit mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wide">Extensible OCR Engine</h3>
              <p className="text-xs text-surface-400 mt-1.5 leading-relaxed">
                Multi-app parsers built for Google Pay, PhonePe, Paytm, BHIM, and Amazon Pay extracting UTR, amount, and timestamp.
              </p>
            </div>

            <div className="razor-card p-5">
              <div className="p-2 rounded bg-brand-600/10 text-brand-400 w-fit mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wide">9-Point Fraud Inspection</h3>
              <p className="text-xs text-surface-400 mt-1.5 leading-relaxed">
                Detects Photoshop traces, text overlays, cloned digit regions, gaussian blurring, and compression anomalies.
              </p>
            </div>

            <div className="razor-card p-5">
              <div className="p-2 rounded bg-brand-600/10 text-brand-400 w-fit mb-3">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wide">Developer First API</h3>
              <p className="text-xs text-surface-400 mt-1.5 leading-relaxed">
                Single & Secret Key pairs (pk_live & sk_live), request metering, usage audit logs, and instant webhook callbacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
