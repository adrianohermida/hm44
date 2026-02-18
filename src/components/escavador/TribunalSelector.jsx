import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function TribunalSelector({ tribunal, onSelect, selected }) {
  return (
    <button
      onClick={() => onSelect(tribunal.sigla)}
      className={`p-3 rounded-lg border-2 transition-all text-left ${
        selected ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]' : 'border-[var(--border-primary)] hover:border-[var(--brand-primary-200)]'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm text-[var(--brand-text-primary)]">{tribunal.sigla}</p>
          <p className="text-xs text-[var(--brand-text-secondary)]">{tribunal.nome}</p>
        </div>
        {selected && <CheckCircle2 className="w-5 h-5 text-[var(--brand-primary)]" />}
      </div>
      <div className="flex flex-wrap gap-1">
        {tribunal.busca_processo && <Badge variant="outline" className="text-xs">Processo</Badge>}
        {tribunal.busca_nome && <Badge variant="outline" className="text-xs">Nome</Badge>}
        {tribunal.busca_oab && <Badge variant="outline" className="text-xs">OAB</Badge>}
        {tribunal.busca_documento && <Badge variant="outline" className="text-xs">CPF/CNPJ</Badge>}
      </div>
    </button>
  );
}