import React from 'react';
import PlanoInfo from './PlanoInfo';
import ParcelasList from './ParcelasList';

export default function PlanoDetail({ honorario, isAdmin, onUpdate }) {
  if (!honorario) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-secondary)]">
        <p className="text-[var(--text-secondary)]">Selecione um plano</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[var(--bg-primary)] p-4 md:p-6">
      <PlanoInfo honorario={honorario} />
      <ParcelasList parcelas={honorario.parcelas || []} honorarioId={honorario.id} isAdmin={isAdmin} onUpdate={onUpdate} />
    </div>
  );
}