import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Key, FileText, CreditCard, Settings, Shield } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'API Keys', path: '/api-keys', icon: Key },
    { name: 'Verification Logs', path: '/logs', icon: FileText },
    { name: 'Billing & Quota', path: '/billing', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-surface-950 border-r border-surface-800 hidden md:flex flex-col min-h-[calc(100vh-3.5rem)] p-3">
      <div className="space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-surface-500">
          Merchant Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20'
                    : 'text-surface-400 hover:text-surface-100 hover:bg-surface-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Subscription Status Widget */}
      <div className="p-3 rounded-lg bg-surface-900 border border-surface-800 mt-auto">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-surface-200">
          <Shield className="w-3.5 h-3.5 text-brand-500" />
          <span>Starter Plan</span>
        </div>
        <p className="text-[10px] text-surface-400 mt-1">1,000 verifications / month</p>
        <div className="w-full bg-surface-800 rounded-full h-1 mt-2 overflow-hidden">
          <div className="bg-brand-500 h-full w-[24%]" />
        </div>
      </div>
    </aside>
  );
};
