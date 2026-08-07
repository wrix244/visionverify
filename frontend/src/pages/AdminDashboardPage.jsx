import React from 'react';
import { ShieldAlert, Users, Server, FileCheck, Lock } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-surface-50 tracking-tight">Platform Admin Gateway</h1>
              <Badge variant="suspicious">System Administrator</Badge>
            </div>
            <p className="text-sm text-surface-400 mt-1">Cross-merchant monitoring, security rate limits & account audit logs</p>
          </div>
        </div>

        {/* System Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Merchants" value="1,248" icon={Users} trend="up" />
          <StatCard title="API Engine Status" value="99.98%" icon={Server} trend="up" />
          <StatCard title="Daily Verifications" value="48,290" icon={FileCheck} trend="up" />
          <StatCard title="Rate Limit Blocks" value="14" icon={Lock} trend="down" />
        </div>

        {/* Audit Log Table */}
        <Card title="Merchant Audit & Role Management" subtitle="Platform administrator account management feed">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs font-semibold uppercase text-surface-400 border-b border-surface-800">
                <tr>
                  <th className="py-3 px-4">Merchant Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Email Verified</th>
                  <th className="py-3 px-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800">
                <tr className="hover:bg-surface-800/30">
                  <td className="py-3 px-4 font-bold text-surface-200">Acme Pay Solutions</td>
                  <td className="py-3 px-4 text-surface-400">merchant@acmepay.com</td>
                  <td className="py-3 px-4"><Badge variant="info">PRO</Badge></td>
                  <td className="py-3 px-4"><Badge variant="authentic">Verified</Badge></td>
                  <td className="py-3 px-4"><Badge variant="active">ACTIVE</Badge></td>
                </tr>
                <tr className="hover:bg-surface-800/30">
                  <td className="py-3 px-4 font-bold text-surface-200">Global Payments Inc</td>
                  <td className="py-3 px-4 text-surface-400">billing@globalpay.org</td>
                  <td className="py-3 px-4"><Badge variant="info">ENTERPRISE</Badge></td>
                  <td className="py-3 px-4"><Badge variant="authentic">Verified</Badge></td>
                  <td className="py-3 px-4"><Badge variant="active">ACTIVE</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};
