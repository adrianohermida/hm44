import React from 'react';
import { Calendar } from 'lucide-react';
import ConsultaLeadCard from './ConsultaLeadCard';

export default function ConsultaGrid({ leads, onApprove, onReject, onSchedule }) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)]">
        <Calendar className="w-12 h-12 md:w-16 md:h-16 text-[var(--text-tertiary)] mx-auto mb-4" aria-hidden="true" />
        <p className="text-sm md:text-base text-[var(--text-secondary)]">
          Nenhuma solicitação encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {leads.map(lead => (
        <ConsultaLeadCard
          key={lead.id}
          lead={lead}
          onApprove={onApprove}
          onReject={onReject}
          onSchedule={onSchedule}
        />
      ))}
    </div>
  );
}