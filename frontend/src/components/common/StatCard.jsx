import React from 'react';

export const StatCard = ({ title, value, change, icon: Icon, trend = 'up' }) => {
  return (
    <div className="razor-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400">{title}</span>
        {Icon && (
          <div className="p-1.5 rounded bg-brand-600/10 text-brand-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-xl font-extrabold text-surface-50 font-mono">{value}</span>
        {change && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
          }`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
