import React from 'react';

export default function MetricCard({ label, value, color = 'text-[var(--text-primary)]' }) {
  return (
    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
      <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}