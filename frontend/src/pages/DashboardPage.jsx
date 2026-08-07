import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, FileCheck, CheckCircle2, Zap, Clock, Calendar, Search, Filter, RefreshCw, BarChart2 } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { UploadDropzone } from '../components/verification/UploadDropzone';
import { VerificationResultCard } from '../components/verification/VerificationResultCard';
import { LogsTable } from '../components/verification/LogsTable';
import { Modal } from '../components/common/Modal';
import { verificationService } from '../services/verification.service';

export const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [apiUsage, setApiUsage] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [minConfidence, setMinConfidence] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, logsRes] = await Promise.all([
        verificationService.getMetrics(),
        verificationService.getLogs({
          page: 1,
          limit: 10,
          status: statusFilter,
          search,
          dateRange,
          minConfidence
        })
      ]);

      if (metricsRes?.data) {
        setMetrics(metricsRes.data.metrics);
        setApiUsage(metricsRes.data.apiUsage);
      }
      if (logsRes?.data?.logs) setRecentLogs(logsRes.data.logs);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter, dateRange, minConfidence]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleUploadProof = async (formData) => {
    setIsUploading(true);
    setLatestResult(null);
    try {
      const res = await verificationService.verifyPaymentProof(formData);
      if (res?.data) {
        setLatestResult(res.data);
        fetchDashboardData();
      }
    } catch (err) {
      alert(err?.message || 'Verification pipeline failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-surface-50 tracking-tight">Merchant Overview</h1>
            <p className="text-xs text-surface-400 mt-0.5">Live verification analytics, quota metering, and proof auditing</p>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchDashboardData} isLoading={loading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Feed
          </Button>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's Requests"
            value={metrics?.todayCount || '0'}
            icon={Clock}
          />
          <StatCard
            title="Successful Verifications"
            value={metrics?.successfulCount || '0'}
            icon={CheckCircle2}
            trend="up"
          />
          <StatCard
            title="Rejected / Suspicious"
            value={metrics?.rejectedCount || '0'}
            icon={AlertTriangle}
            trend="down"
          />
          <StatCard
            title="Average Confidence"
            value={metrics?.avgConfidence || '95.0%'}
            icon={BarChart2}
            trend="up"
          />
        </div>

        {/* API Usage & Quota Gauge Card */}
        <div className="razor-card p-4 border border-brand-500/20 bg-brand-600/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Monthly API Usage & Metering</span>
              </div>
              <h3 className="text-base font-bold text-surface-100 mt-1 font-mono">
                {apiUsage?.usedQuota || 0} / {apiUsage?.monthlyQuota || 1000} Verifications Used
              </h3>
              <p className="text-xs text-surface-400 mt-0.5">
                {apiUsage?.remainingQuota || 1000} verifications remaining in current billing cycle
              </p>
            </div>
            <div className="w-full sm:w-64 bg-surface-900 rounded-full h-3 border border-surface-800 p-0.5 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, ((apiUsage?.usedQuota || 0) / (apiUsage?.monthlyQuota || 1000)) * 100)}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Upload & Pipeline Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Instant Unified Verification Pipeline" subtitle="Upload a payment screenshot to execute OCR, 9-point Fraud Inspection & Validation">
            <UploadDropzone onUpload={handleUploadProof} isLoading={isUploading} />
          </Card>

          <div>
            {latestResult ? (
              <VerificationResultCard result={latestResult} />
            ) : (
              <div className="razor-card p-8 flex flex-col items-center justify-center text-center h-full min-h-[260px]">
                <div className="p-3 rounded-xl bg-brand-600/10 text-brand-400 mb-3">
                  <Zap className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-surface-200 uppercase tracking-wide">Awaiting Verification Request</h4>
                <p className="text-xs text-surface-400 max-w-xs mt-1">
                  Upload a payment proof on the left dropzone to execute the 7-step pipeline and view instant Master Verdicts.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Logs Filter Bar */}
        <Card title="Verification Audit Feed & Filters" subtitle="Search and filter payment proofs by date, confidence, or status">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Search UTR or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-lg text-sm text-surface-100 focus:outline-none focus:border-brand-600"
              >
                <option value="all">Date: All Time</option>
                <option value="today">Date: Today Only</option>
                <option value="7days">Date: Last 7 Days</option>
                <option value="30days">Date: Last 30 Days</option>
              </select>
            </div>

            <div>
              <select
                value={minConfidence}
                onChange={(e) => setMinConfidence(e.target.value)}
                className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-lg text-sm text-surface-100 focus:outline-none focus:border-brand-600"
              >
                <option value="">Confidence: All Thresholds</option>
                <option value="90">High Confidence (&gt; 90%)</option>
                <option value="70">Medium Confidence (70% - 90%)</option>
                <option value="0">Low Confidence (&lt; 70%)</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-surface-950 border border-surface-800 rounded-lg text-sm text-surface-100 focus:outline-none focus:border-brand-600"
              >
                <option value="">Status: All Statuses</option>
                <option value="AUTHENTIC">Authentic Only</option>
                <option value="SUSPICIOUS">Suspicious Only</option>
                <option value="REJECTED">Rejected Only</option>
              </select>
            </div>
          </form>

          {/* Logs Feed Table */}
          <LogsTable logs={recentLogs} onSelectLog={(log) => setSelectedLog(log)} />
        </Card>

        {/* Verification Inspector Details Modal */}
        <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Verification Log Audit">
          {selectedLog && <VerificationResultCard result={selectedLog} />}
        </Modal>
      </div>
    </AppLayout>
  );
};
