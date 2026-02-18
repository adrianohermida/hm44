import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, ExternalLink } from 'lucide-react';

export default function FonteTribunalCard({ fonte }) {
  return (
    <div className="p-3 bg-[var(--brand-bg-secondary)] rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[var(--brand-text-tertiary)]" />
          <p className="font-semibold text-sm text-[var(--brand-text-primary)]">{fonte.sigla}</p>
        </div>
        <Badge variant="outline" className="text-xs">{fonte.grau_formatado}</Badge>
      </div>
      <p className="text-xs text-[var(--brand-text-secondary)] mb-2">{fonte.descricao}</p>
      {fonte.url && (
        <a href={fonte.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--brand-primary)] hover:underline flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          Acessar tribunal
        </a>
      )}
    </div>
  );
}