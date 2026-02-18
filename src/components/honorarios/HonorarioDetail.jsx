import React from 'react';
import { Card } from '@/components/ui/card';
import ParcelasList from './ParcelasList';

export default function HonorarioDetail({ honorario, isAdmin, onUpdate }) {
  if (!honorario) {
    return (
      <Card className="lg:col-span-2 p-8 bg-[var(--bg-primary)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Selecione um plano</p>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 p-6 bg-[var(--bg-primary)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{honorario.tipo}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[var(--text-secondary)]">Modalidade:</span>
            <p className="font-semibold text-[var(--text-primary)]">{honorario.modalidade}</p>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Status:</span>
            <p className="font-semibold text-[var(--text-primary)]">{honorario.status}</p>
          </div>
        </div>
      </div>
      <ParcelasList parcelas={honorario.parcelas || []} honorarioId={honorario.id} isAdmin={isAdmin} onUpdate={onUpdate} />
    </Card>
  );
}