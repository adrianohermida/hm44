import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function ConsultaInfo({ email, telefone }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
        <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span className="truncate">{email}</span>
      </div>
      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
        <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>{telefone}</span>
      </div>
    </div>
  );
}