import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-surface-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 bg-surface-950 border rounded-lg text-sm text-surface-100 placeholder-surface-500 focus:outline-none transition-all duration-150 ${
          error
            ? 'border-rose-500 focus:border-rose-500'
            : 'border-surface-800 focus:border-brand-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-surface-500 mt-1">{helperText}</p>}
    </div>
  );
};
