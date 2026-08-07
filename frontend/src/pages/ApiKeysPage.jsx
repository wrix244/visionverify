import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Trash2, RefreshCw, AlertCircle, Check, Eye, Clock, ShieldCheck, Activity } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { apiKeyService } from '../services/apiKey.service';

export const ApiKeysPage = () => {
  const [activeTab, setActiveTab] = useState('keys'); // 'keys' | 'logs'
  const [keys, setKeys] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [selectedKeyForRegen, setSelectedKeyForRegen] = useState(null);

  // Form states
  const [keyName, setKeyName] = useState('');
  const [expirationOption, setExpirationOption] = useState('never'); // never, 30days, 90days, 1year
  const [createdSecretKey, setCreatedSecretKey] = useState(null);
  const [createdPublicKey, setCreatedPublicKey] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const fetchKeys = async () => {
    try {
      const res = await apiKeyService.getApiKeys();
      if (res?.data) setKeys(res.data);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await apiKeyService.getUsageLogs();
      if (res?.data?.logs) setLogs(res.data.logs);
    } catch (err) {
      console.error('Failed to fetch API usage logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const calculateExpiresAt = (option) => {
    const now = new Date();
    if (option === '30days') return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    if (option === '90days') return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();
    if (option === '1year') return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
    return null;
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      const expiresAt = calculateExpiresAt(expirationOption);
      const res = await apiKeyService.createApiKey(keyName || 'Production API Key', expiresAt);
      if (res?.data) {
        setCreatedSecretKey(res.data.secretKey);
        setCreatedPublicKey(res.data.publicKey);
        fetchKeys();
      }
    } catch (err) {
      alert(err?.message || 'Failed to create API key');
    }
  };

  const handleRegenerateKey = async () => {
    if (!selectedKeyForRegen) return;
    try {
      const res = await apiKeyService.regenerateApiKey(selectedKeyForRegen._id);
      if (res?.data) {
        setCreatedSecretKey(res.data.secretKey);
        setCreatedPublicKey(res.data.publicKey);
        setIsRegenerateModalOpen(false);
        setIsCreateModalOpen(true);
        fetchKeys();
      }
    } catch (err) {
      alert(err?.message || 'Failed to regenerate API key');
    }
  };

  const handleRevokeKey = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this API key pair? Any backend integration using pk_live or sk_live for this key will immediately stop working.')) return;
    try {
      await apiKeyService.revokeApiKey(id);
      fetchKeys();
    } catch (err) {
      alert(err?.message || 'Failed to revoke API key');
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-surface-50 tracking-tight">API Keys & Usage Management</h1>
            <p className="text-sm text-surface-400 mt-1">Manage Public (pk_live_...) & Secret (sk_live_...) API key pairs for server-to-server payment proof verification</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => {
                setCreatedSecretKey(null);
                setCreatedPublicKey(null);
                setKeyName('');
                setIsCreateModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Generate Key Pair
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-surface-800 pb-2">
          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'keys'
                ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/40'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Active Key Credentials</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'logs'
                ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/40'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>API Usage Audit Logs</span>
          </button>
        </div>

        {activeTab === 'keys' ? (
          <>
            {/* Header Code Integration Guide */}
            <div className="glass-panel p-5 rounded-2xl border border-brand-500/20 bg-brand-500/5">
              <div className="flex items-center space-x-2 text-brand-400 font-semibold text-sm mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>API Header Specifications</span>
              </div>
              <p className="text-xs text-surface-300">
                Pass your Secret Key in <code className="bg-surface-900 px-2 py-0.5 rounded text-brand-300 font-mono">x-api-key: sk_live_...</code> for backend operations or Public Key in <code className="bg-surface-900 px-2 py-0.5 rounded text-indigo-300 font-mono">x-public-key: pk_live_...</code> for frontend client requests.
              </p>
            </div>

            {/* Keys Table Card */}
            <Card title="Merchant Key Pairs" subtitle="Active public & secret key pairs configured for your merchant account">
              {keys.length === 0 ? (
                <div className="text-center py-12 text-surface-400 text-sm">
                  No API key pairs generated yet. Click "Generate Key Pair" to issue your first credentials.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs font-semibold uppercase text-surface-400 border-b border-surface-800">
                      <tr>
                        <th className="py-3 px-4">Key Name</th>
                        <th className="py-3 px-4">Public Key (pk_live)</th>
                        <th className="py-3 px-4">Secret Key (sk_live)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Expires</th>
                        <th className="py-3 px-4">Requests</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-800">
                      {keys.map((key) => (
                        <tr key={key._id} className="hover:bg-surface-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-surface-100">{key.name}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs text-brand-400 bg-surface-900 px-2 py-1 rounded border border-surface-800">
                                {key.publicKey}
                              </span>
                              <button
                                onClick={() => copyToClipboard(key.publicKey, `pk_${key._id}`)}
                                title="Copy Public Key"
                                className="p-1 rounded text-surface-400 hover:text-white"
                              >
                                {copiedField === `pk_${key._id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-surface-400">
                            {key.secretKeyPrefix}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={key.status}>{key.status}</Badge>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-surface-400">
                            {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-surface-300 font-semibold">
                            {key.usageCount || 0} reqs
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {key.status === 'ACTIVE' && (
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedKeyForRegen(key);
                                    setIsRegenerateModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-surface-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                                  title="Regenerate / Rotate Key Pair"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRevokeKey(key._id)}
                                  className="p-1.5 rounded-lg text-surface-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  title="Revoke Key"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        ) : (
          /* Usage Audit Logs Tab */
          <Card title="API Request Audit Feed" subtitle="Real-time request logs for programmatic API calls">
            {logsLoading ? (
              <div className="py-12 text-center text-surface-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
                <p className="mt-2 text-xs">Loading API usage audit logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-surface-400 text-sm">
                No API requests recorded yet. Integrate your key pair to view API traffic here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs font-semibold uppercase text-surface-400 border-b border-surface-800">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Key Name</th>
                      <th className="py-3 px-4">HTTP Method & Endpoint</th>
                      <th className="py-3 px-4">Status Code</th>
                      <th className="py-3 px-4">Client IP</th>
                      <th className="py-3 px-4 text-right">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-800">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-surface-800/30 transition-colors">
                        <td className="py-3 px-4 text-xs text-surface-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-surface-200">
                          {log.apiKeyId?.name || 'API Key'}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">
                          <span className="text-brand-400 font-bold mr-2">{log.method}</span>
                          <span className="text-surface-300">{log.endpoint}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold ${
                            log.statusCode < 300 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-surface-400">{log.ipAddress || '127.0.0.1'}</td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-surface-300">
                          {log.responseTimeMs || 12} ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Modal for Key Creation & Single-View Reveal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={createdSecretKey ? 'API Key Pair Issued' : 'Generate New Key Pair'}
        >
          {createdSecretKey ? (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Save your Secret Key (sk_live_...) immediately! It will never be displayed again.</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1">
                    Public Key (pk_live)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input value={createdPublicKey} readOnly className="font-mono text-xs text-brand-400" />
                    <Button onClick={() => copyToClipboard(createdPublicKey, 'modal_pk')} variant="secondary">
                      {copiedField === 'modal_pk' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1">
                    Secret Key (sk_live)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input value={createdSecretKey} readOnly className="font-mono text-xs text-emerald-400" />
                    <Button onClick={() => copyToClipboard(createdSecretKey, 'modal_sk')} variant="secondary">
                      {copiedField === 'modal_sk' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={() => setIsCreateModalOpen(false)} className="w-full mt-4">
                I Have Stored My Secret Key Safely
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCreateKey} className="space-y-4">
              <Input
                label="Key Pair Label Name"
                placeholder="e.g. Production Node Gateway"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5">
                  Expiration Policy
                </label>
                <select
                  value={expirationOption}
                  onChange={(e) => setExpirationOption(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-900 border border-surface-800 rounded-lg text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="never">Never Expires (Recommended)</option>
                  <option value="30days">Expire in 30 Days</option>
                  <option value="90days">Expire in 90 Days</option>
                  <option value="1year">Expire in 1 Year</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Generate Key Pair
                </Button>
              </div>
            </form>
          )}
        </Modal>

        {/* Modal for Key Regeneration Confirmation */}
        <Modal
          isOpen={isRegenerateModalOpen}
          onClose={() => setIsRegenerateModalOpen(false)}
          title="Regenerate API Key Pair"
        >
          <div className="space-y-4">
            <p className="text-sm text-surface-300">
              Are you sure you want to regenerate the API key pair for <strong className="text-white">{selectedKeyForRegen?.name}</strong>?
            </p>
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Regenerating will immediately revoke the current key pair. Any backend server using the existing keys will fail until updated.</span>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="ghost" onClick={() => setIsRegenerateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleRegenerateKey}>
                Confirm & Regenerate
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
};
