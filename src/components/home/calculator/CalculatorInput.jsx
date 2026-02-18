import React from 'react';

export default function CalculatorInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  example, 
  helperText,
  type = 'number'
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm sm:text-base font-semibold text-[var(--text-primary)]">
        {label}
        {example && (
          <span className="text-[var(--text-tertiary)] font-normal ml-2 text-xs sm:text-sm">
            (Ex: {example})
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || example}
        className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-[var(--border-primary)] rounded-xl focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-100)] outline-none bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all"
      />
      {helperText && (
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
}