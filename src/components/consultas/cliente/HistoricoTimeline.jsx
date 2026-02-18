import React from 'react';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

const eventIcons = {
  solicitado: Clock,
  aprovado: CheckCircle,
  agendado: Calendar,
  cancelado: XCircle,
  realizado: CheckCircle
};

const eventColors = {
  solicitado: 'text-blue-600',
  aprovado: 'text-green-600',
  agendado: 'text-purple-600',
  cancelado: 'text-red-600',
  realizado: 'text-green-600'
};

export default function HistoricoTimeline({ eventos }) {
  if (!eventos || eventos.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[var(--text-primary)]">Histórico</h3>
      <div className="space-y-3">
        {eventos.map((evento, idx) => {
          const Icon = eventIcons[evento.tipo] || Clock;
          const color = eventColors[evento.tipo] || 'text-gray-600';
          
          return (
            <div key={idx} className="flex gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">{evento.descricao}</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {new Date(evento.data).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}