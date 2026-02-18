import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function LeadMessage({ mensagem }) {
  if (!mensagem) return null;

  return (
    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-[var(--brand-primary)]" />
        <h3 className="font-semibold text-[var(--text-primary)]">Mensagem</h3>
      </div>
      <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
        {mensagem}
      </p>
    </div>
  );
}