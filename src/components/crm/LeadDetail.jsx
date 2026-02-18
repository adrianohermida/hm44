import React from 'react';
import LeadInfo from './LeadInfo';
import LeadContactInfo from './LeadContactInfo';
import LeadMessage from './LeadMessage';

export default function LeadDetail({ lead }) {
  if (!lead) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-secondary)]">
        <p className="text-[var(--text-secondary)]">Selecione um lead</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[var(--bg-primary)] p-4 md:p-6 space-y-6">
      <LeadInfo lead={lead} />
      <LeadContactInfo lead={lead} />
      <LeadMessage mensagem={lead.mensagem} />
    </div>
  );
}