import React from 'react';
import LeadCard from './LeadCard';

export default function LeadsList({ leads, selected, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--text-secondary)] text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border-primary)]">
        <h2 className="font-semibold text-[var(--text-primary)] text-lg">Leads</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {leads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            isSelected={selected?.id === lead.id}
            onClick={() => onSelect(lead)}
          />
        ))}
        {leads.length === 0 && (
          <p className="text-[var(--text-secondary)] text-center py-8 text-sm">
            Nenhum lead encontrado
          </p>
        )}
      </div>
    </div>
  );
}