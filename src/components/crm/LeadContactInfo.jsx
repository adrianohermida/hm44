import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function LeadContactInfo({ lead }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex items-center gap-3">
        <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Email</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">{lead.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Phone className="w-5 h-5 text-[var(--brand-primary)]" />
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Telefone</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">{lead.telefone}</p>
        </div>
      </div>
    </div>
  );
}