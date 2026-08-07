import React, { useState } from 'react';
import { Settings, Save, Shield, Bell, Webhook } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';

export const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [webhookUrl, setWebhookUrl] = useState(user?.webhookUrl || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await authService.updateProfile({ name, companyName, webhookUrl });
      if (res?.data) {
        setUser(res.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert(err?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-surface-50 tracking-tight">Account & Webhook Settings</h1>
          <p className="text-sm text-surface-400 mt-1">Configure merchant organization profile and automated event notifications</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          {saved && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              Settings updated successfully!
            </div>
          )}

          {/* Profile Section */}
          <Card title="Merchant Profile" subtitle="Basic user account details">
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Account Email"
                value={user?.email || ''}
                disabled
                helperText="Email cannot be changed directly"
              />
              <Input
                label="Company / Merchant Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </Card>

          {/* Webhook Configuration Section */}
          <Card title="Webhook Integration" subtitle="Receive instant HTTP POST callbacks when payment proofs are analyzed">
            <div className="space-y-4">
              <Input
                label="Webhook Endpoint URL"
                placeholder="https://api.yourdomain.com/webhooks/verifyflow"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                helperText="VerifyFlow will send JSON payload with verification results & confidence scores upon every completed upload"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" isLoading={loading} className="min-w-[140px]">
              <Save className="w-4 h-4 mr-2" /> Save Settings
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
