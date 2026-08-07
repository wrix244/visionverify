import React from 'react';

export const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    authentic: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    suspicious: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    pending: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    revoked: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-brand-600/10 text-brand-400 border-brand-500/20'
  };

  const key = variant.toLowerCase();
  const selectedVariant = variants[key] || variants.info;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${selectedVariant} ${className}`}>
      {children}
    </span>
  );
};
