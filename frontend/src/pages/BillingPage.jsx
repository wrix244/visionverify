import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Zap, ShieldCheck, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { billingService } from '../services/billing.service';

export const BillingPage = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const fetchSubscription = async () => {
    try {
      const res = await billingService.getSubscription();
      if (res?.data) setSubscription(res.data);
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;
    setUpgrading(true);
    try {
      const res = await billingService.upgradePlan(selectedPlan.name);
      if (res?.data) {
        setSubscription(res.data);
        setIsModalOpen(false);
        alert(`Successfully upgraded to ${selectedPlan.name} Tier!`);
      }
    } catch (err) {
      alert(err?.message || 'Upgrade failed');
    } finally {
      setUpgrading(false);
    }
  };

  const plans = [
    {
      name: 'FREE',
      price: '$0',
      priceInr: '₹0',
      period: '/month',
      verifications: '100 verifications / month',
      rateLimit: '30 requests / min',
      apiKeys: '1 API Key Pair',
      support: 'Standard Documentation',
      current: (subscription?.tier || 'FREE') === 'FREE'
    },
    {
      name: 'STARTER',
      price: '$29',
      priceInr: '₹2,499',
      period: '/month',
      verifications: '1,000 verifications / month',
      rateLimit: '120 requests / min',
      apiKeys: '3 API Key Pairs',
      support: 'Email Support & Webhooks',
      current: subscription?.tier === 'STARTER'
    },
    {
      name: 'PRO',
      price: '$99',
      priceInr: '₹7,999',
      period: '/month',
      verifications: '10,000 verifications / month',
      rateLimit: '300 requests / min',
      apiKeys: '10 API Key Pairs',
      support: 'Priority 24/7 Support & Webhooks',
      popular: true,
      current: subscription?.tier === 'PRO'
    },
    {
      name: 'ENTERPRISE',
      price: '$299',
      priceInr: '₹24,999',
      period: '/month',
      verifications: '100,000 verifications / month',
      rateLimit: '1,000 requests / min',
      apiKeys: '50 API Key Pairs',
      support: 'Dedicated Account Manager & SLA',
      current: subscription?.tier === 'ENTERPRISE'
    }
  ];

  const usedQuota = subscription?.usedQuota || 0;
  const monthlyQuota = subscription?.monthlyQuota || 100;
  const remainingQuota = Math.max(0, monthlyQuota - usedQuota);
  const quotaPercent = Math.min(100, Math.round((usedQuota / monthlyQuota) * 100));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-surface-50 tracking-tight">Subscriptions & API Metering</h1>
          <p className="text-sm text-surface-400 mt-1">Manage your merchant billing tier, usage limits, and monthly quota resets</p>
        </div>

        {/* Current Plan & Metering Gauge Card */}
        <Card title="Current Subscription & Quota Usage">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-surface-100">{subscription?.tier || 'FREE'} Tier</h3>
                    <Badge variant="active">Active Plan</Badge>
                  </div>
                  <p className="text-xs text-surface-400 mt-0.5">
                    Monthly Quota resets on {subscription?.quotaResetDate ? new Date(subscription.quotaResetDate).toLocaleDateString() : 'Next Cycle'}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-surface-400 uppercase tracking-wider font-semibold block">Remaining Quota</span>
                <span className="text-2xl font-bold text-emerald-400">{remainingQuota.toLocaleString()} Reqs</span>
              </div>
            </div>

            {/* Quota Progress Gauge Bar */}
            <div>
              <div className="flex justify-between text-xs text-surface-300 font-semibold mb-1.5">
                <span>{usedQuota.toLocaleString()} Used</span>
                <span>{monthlyQuota.toLocaleString()} Monthly Limit ({quotaPercent}%)</span>
              </div>
              <div className="w-full bg-surface-900 rounded-full h-3.5 border border-surface-800 p-0.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    quotaPercent >= 90 ? 'bg-rose-500' : quotaPercent >= 75 ? 'bg-amber-500' : 'bg-gradient-to-r from-brand-500 to-indigo-500'
                  }`}
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 4 Pricing Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card rounded-2xl p-6 border flex flex-col justify-between relative ${
                plan.current
                  ? 'border-brand-500 bg-brand-500/5 shadow-xl shadow-brand-500/10'
                  : plan.popular
                  ? 'border-indigo-500/40 bg-surface-900/60'
                  : 'border-surface-800'
              }`}
            >
              {plan.popular && !plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-bold tracking-wider uppercase shadow">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-surface-400">{plan.name}</span>
                  {plan.current && <Badge variant="info">Current</Badge>}
                </div>
                <div className="flex items-baseline space-x-1 mb-1">
                  <span className="text-3xl font-extrabold text-surface-50">{plan.price}</span>
                  <span className="text-xs text-surface-400">{plan.period}</span>
                </div>
                <p className="text-xs text-surface-500 mb-6">({plan.priceInr} / month)</p>

                <ul className="space-y-3 text-xs text-surface-300 mb-8">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{plan.verifications}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{plan.rateLimit}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{plan.apiKeys}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{plan.support}</span>
                  </li>
                </ul>
              </div>

              <Button
                variant={plan.current ? 'outline' : 'primary'}
                disabled={plan.current}
                onClick={() => handleSelectPlan(plan)}
                className="w-full"
              >
                {plan.current ? 'Active Tier' : `Select ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        {/* Upgrade Confirmation Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Upgrade to ${selectedPlan?.name} Tier`}
        >
          {selectedPlan && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-900 border border-surface-800 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-surface-100">
                  <span>{selectedPlan.name} Subscription</span>
                  <span className="text-brand-400">{selectedPlan.price} / month</span>
                </div>
                <p className="text-xs text-surface-400">{selectedPlan.verifications}</p>
                <p className="text-xs text-surface-400">Rate Limit: {selectedPlan.rateLimit}</p>
              </div>

              <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 flex items-start space-x-2">
                <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Your API monthly quota will be updated immediately. Stripe Billing Checkout integration will initiate.</span>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button isLoading={upgrading} onClick={handleConfirmUpgrade}>
                  Confirm & Subscribe <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  );
};
