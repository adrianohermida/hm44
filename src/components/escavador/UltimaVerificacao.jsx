import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function UltimaVerificacao({ dataVerificacao, tempoDesde }) {
  if (!dataVerificacao) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-[var(--brand-text-tertiary)]">
      <Clock className="w-3 h-3" />
      <span>
        Última verificação: {tempoDesde || format(new Date(dataVerificacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
      </span>
    </div>
  );
}