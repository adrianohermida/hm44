import React from 'react';
import LeadTemperature from './LeadTemperature';

export default function LeadCard({ lead, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected 
          ? 'bg-[var(--brand-primary-100)] border-l-4 border-[var(--brand-primary)]' 
          : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-[var(--text-primary)] truncate flex-1">
          {lead.nome}
        </h3>
        <LeadTemperature temperatura={lead.temperatura} />
      </div>
      <p className="text-xs text-[var(--text-secondary)] truncate">
        {lead.email}
      </p>
      <p className="text-xs text-[var(--text-tertiary)] mt-1">
        Score: {lead.score}
      </p>
    </button>
  );
}