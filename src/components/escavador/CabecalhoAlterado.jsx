import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CabecalhoAlterado({ campo, valorAntigo, valorNovo, dataAlteracao }) {
  const campoLabels = {
    area: 'Área',
    assunto: 'Assunto',
    classe: 'Classe',
    orgao_julgador: 'Órgão Julgador',
    data_distribuicao: 'Data de Distribuição',
    valor_causa: 'Valor da Causa'
  };

  return (
    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
      <p className="text-xs font-semibold text-[var(--brand-text-primary)] mb-2">
        {campoLabels[campo] || campo}
      </p>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--brand-text-secondary)]">{valorAntigo}</span>
        <ArrowRight className="w-4 h-4 text-yellow-600" />
        <span className="font-medium text-[var(--brand-text-primary)]">{valorNovo}</span>
      </div>
    </div>
  );
}