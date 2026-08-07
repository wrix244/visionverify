import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, X, Calendar, BarChart2 } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { LogsTable } from '../components/verification/LogsTable';
import { VerificationResultCard } from '../components/verification/VerificationResultCard';
import { Modal } from '../components/common/Modal';
import { verificationService } from '../services/verification.service';

export const VerificationLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [minConfidence, setMinConfidence] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await verificationService.getLogs({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
        search,
        dateRange,
        minConfidence
      });
      if (res?.data) {
        setLogs(res.data.logs);
        setPagination(prev => ({ ...prev, ...res.data.pagination }));
      }
    } catch (err) {
      console.error('Failed to fetch verification logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, statusFilter, dateRange, minConfidence]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-surface-50 tracking-tight">Verification Audit Logs</h1>
            <p className="text-sm text-surface-400 mt-1">Search, filter, and inspect uploaded payment proof screenshots</p>
          </div>
          <Button variant="secondary" onClick={fetchLogs} isLoading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Feed
          </Button>
        </div>

        {/* Filters Bar */}
        <Card title="Log Filter Controls">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search UTR, payee, or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-900 border border-surface-800 rounded-lg text-sm text-surface-100 focus:outline-none focus:border-brand-500"
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
                className="w-full px-3.5 py-2.5 bg-surface-900 border border-surface-800 rounded-lg text-sm text-surface-100 focus:outline-none focus:border-brand-500"
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
                className="w-full px-3.5 py-2.5 bg-surface-900 border border-surface-800 rounded-lg text-sm text-surface-100 focus:outline-none focus:border-brand-500"
              >
                <option value="">Status: All Statuses</option>
                <option value="AUTHENTIC">Authentic Only</option>
                <option value="SUSPICIOUS">Suspicious Only</option>
                <option value="REJECTED">Rejected Only</option>
              </select>
            </div>
          </form>
        </Card>

        {/* Logs Table Card */}
        <Card>
          <LogsTable logs={logs} onSelectLog={(log) => setSelectedLog(log)} />

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-800 text-xs text-surface-400">
            <span>Page {pagination.page} of {pagination.totalPages || 1}</span>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>

        {/* Log Inspector Modal */}
        <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Verification Audit Details">
          {selectedLog && <VerificationResultCard result={selectedLog} />}
        </Modal>
      </div>
    </AppLayout>
  );
};
