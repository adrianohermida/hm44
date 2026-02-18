import React from 'react';

export default function MediaStatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl p-6 text-center hover:border-[var(--brand-primary)] transition-all">
      <Icon className={`w-10 h-10 mx-auto mb-3 ${color}`} />
      <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{value}</div>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}