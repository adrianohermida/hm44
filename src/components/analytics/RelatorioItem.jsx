import React from 'react';

export default function RelatorioItem({ report, isSelected, onClick }) {
  const Icon = report.icon;
  
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
        isSelected 
          ? 'bg-[var(--brand-primary-100)] border-l-4 border-[var(--brand-primary)]' 
          : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
      }`}
    >
      <Icon className="w-5 h-5 text-[var(--brand-primary)]" />
      <span className="font-medium text-[var(--text-primary)]">{report.label}</span>
    </button>
  );
}