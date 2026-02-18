import React from 'react';
import ParcelaItem from './ParcelaItem';

export default function ParcelasList({ parcelas, honorarioId, isAdmin, onUpdate }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-[var(--text-primary)] mb-3">Parcelas</h3>
      {parcelas.map((parcela, index) => (
        <ParcelaItem key={index} parcela={parcela} index={index} isAdmin={isAdmin} />
      ))}
      {parcelas.length === 0 && (
        <p className="text-[var(--text-secondary)] text-center py-4">Nenhuma parcela</p>
      )}
    </div>
  );
}