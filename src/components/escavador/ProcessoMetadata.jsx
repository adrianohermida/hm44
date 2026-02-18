import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Building2, Scale } from 'lucide-react';

export default function ProcessoMetadata({ processo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[var(--brand-bg-secondary)] rounded-lg">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[var(--brand-text-tertiary)]" />
        <div>
          <p className="text-xs text-[var(--brand-text-secondary)]">Distribuição</p>
          <p className="text-sm font-medium text-[var(--brand-text-primary)]">
            {format(new Date(processo.data_distribuicao), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-[var(--brand-text-tertiary)]" />
        <div>
          <p className="text-xs text-[var(--brand-text-secondary)]">Tribunal</p>
          <p className="text-sm font-medium text-[var(--brand-text-primary)]">
            {processo.tribunal_info?.sigla || processo.origem}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-[var(--brand-text-tertiary)]" />
        <div>
          <p className="text-xs text-[var(--brand-text-secondary)]">Área</p>
          <p className="text-sm font-medium text-[var(--brand-text-primary)]">
            {processo.area || 'Não informado'}
          </p>
        </div>
      </div>
    </div>
  );
}