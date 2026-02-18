import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ConsultaItemButton({ consulta, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2 rounded border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-3 h-3 text-[var(--brand-primary)]" />
        <span className="text-xs font-medium text-[var(--text-primary)]">
          {format(new Date(consulta.data_hora), "dd/MM 'às' HH:mm", { locale: ptBR })}
        </span>
      </div>
      <p className="text-xs text-[var(--text-secondary)]">
        {consulta.tipo_atendimento}
      </p>
    </button>
  );
}