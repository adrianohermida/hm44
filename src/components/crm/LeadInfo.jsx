import React from 'react';
import LeadTemperature from './LeadTemperature';
import { TrendingUp } from 'lucide-react';

export default function LeadInfo({ lead }) {
  return (
    <div className="border-b border-[var(--border-primary)] pb-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
            {lead.nome}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="w-4 h-4 text-[var(--brand-primary)]" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Score: {lead.score}
            </span>
          </div>
        </div>
        <LeadTemperature temperatura={lead.temperatura} />
      </div>
    </div>
  );
}