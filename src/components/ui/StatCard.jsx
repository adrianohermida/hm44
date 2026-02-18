import React from 'react';

export default function StatCard({ value, label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center p-6 bg-[var(--bg-elevated)] rounded-xl shadow-md border border-[var(--bg-tertiary)] transition-colors">
      {Icon && (
        <div className="w-12 h-12 bg-[var(--brand-primary-100)] rounded-lg flex items-center justify-center mb-3">
          <Icon className="w-6 h-6 text-[var(--brand-primary)]" />
        </div>
      )}
      <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{value}</div>
      <div className="text-sm text-[var(--text-secondary)]">{label}</div>
    </div>
  );
}