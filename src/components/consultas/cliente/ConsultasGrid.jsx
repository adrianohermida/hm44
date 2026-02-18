import React from 'react';
import AgendamentoCard from './AgendamentoCard';

export default function ConsultasGrid({ agendamentos, onRemarcar, onCancelar, loading }) {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {agendamentos.map((agendamento) => (
        <AgendamentoCard
          key={agendamento.id}
          agendamento={agendamento}
          onRemarcar={onRemarcar}
          onCancelar={onCancelar}
          loading={loading}
        />
      ))}
    </div>
  );
}