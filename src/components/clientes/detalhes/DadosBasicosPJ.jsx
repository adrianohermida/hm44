import React from 'react';
import { Building2, FileText } from 'lucide-react';
import ClienteStatusBadge from '../ClienteStatusBadge';

export default function DadosBasicosPJ({ cliente }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">Status</span>
        <ClienteStatusBadge status={cliente.status} />
      </div>
      {cliente.cnpj && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">CNPJ</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">{cliente.cnpj}</span>
        </div>
      )}
      {cliente.nome_completo && (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="text-sm text-[var(--text-primary)]">{cliente.nome_completo}</span>
        </div>
      )}
    </div>
  );
}