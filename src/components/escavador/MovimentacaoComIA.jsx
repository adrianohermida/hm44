import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ClassificacaoIABadge from './ClassificacaoIABadge';

export default function MovimentacaoComIA({ mov }) {
  return (
    <div className="p-3 border-l-2 border-[var(--brand-primary-200)]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-[var(--brand-text-primary)]">
          {format(new Date(mov.data), 'dd/MM/yyyy', { locale: ptBR })}
        </span>
        {mov.classificacao_predita && (
          <ClassificacaoIABadge classificacao={mov.classificacao_predita} />
        )}
      </div>
      <p className="text-sm text-[var(--brand-text-secondary)] leading-relaxed">
        {mov.conteudo}
      </p>
    </div>
  );
}