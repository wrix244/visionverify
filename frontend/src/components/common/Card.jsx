import React from 'react';

export const Card = ({ children, className = '', title, subtitle, action, ...props }) => {
  return (
    <div className={`razor-card p-5 ${className}`} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-800">
          <div>
            {title && <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wide">{title}</h3>}
            {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
