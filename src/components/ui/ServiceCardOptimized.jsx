import React from 'react';

export default function ServiceCardOptimized({ icon: Icon, title, desc }) {
  return (
    <div className="group bg-[var(--bg-elevated)] p-6 rounded-xl border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all duration-300 hover:shadow-lg">
      <div className="w-14 h-14 bg-[var(--brand-primary-100)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--brand-primary)] transition-colors">
        <Icon className="w-7 h-7 text-[var(--brand-primary)] group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-bold text-[var(--text-primary)] mb-3 text-lg group-hover:text-[var(--brand-primary)] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
    </div>
  );
}