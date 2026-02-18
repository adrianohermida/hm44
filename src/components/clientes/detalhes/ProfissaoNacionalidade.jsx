import React from 'react';
import { Briefcase, Globe } from 'lucide-react';

export default function ProfissaoNacionalidade({ cliente }) {
  if (!cliente.profissao && !cliente.nacionalidade) return null;

  return (
    <div className="space-y-2 pt-2 border-t border-[var(--border-primary)]">
      {cliente.profissao && (
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="text-sm text-[var(--text-primary)]">{cliente.profissao}</span>
        </div>
      )}
      {cliente.nacionalidade && (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="text-sm text-[var(--text-primary)]">{cliente.nacionalidade}</span>
        </div>
      )}
    </div>
  );
}