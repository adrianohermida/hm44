import React from 'react';

export default function ServiceCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[var(--brand-primary-200)] hover:shadow-lg transition-all">
      <Icon className="w-10 h-10 text-[var(--brand-primary)] mb-4" />
      <h3 className="font-bold text-[var(--brand-text-primary)] mb-2 text-lg">{title}</h3>
      <p className="text-sm text-[var(--brand-text-secondary)] leading-relaxed">{desc}</p>
    </div>
  );
}