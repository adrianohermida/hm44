import React from 'react';

export default function BookingHeader({ slot, date }) {
  const horario = `${slot.start.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})} - ${slot.end.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
  const dataFormatada = new Date(date).toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="mb-4 p-3 bg-[var(--brand-primary-50)] rounded-lg">
      <p className="text-sm text-[var(--text-secondary)] mb-1">Horário Selecionado:</p>
      <p className="font-bold text-[var(--brand-primary-700)]">{dataFormatada}</p>
      <p className="font-semibold text-[var(--text-primary)]">{horario}</p>
    </div>
  );
}