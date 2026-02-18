import React from 'react';
import ProcessoResumoExecutivo from '@/components/processos/ProcessoResumoExecutivo';
import ProcessoProgressBar from '@/components/processos/ProcessoProgressBar';

export default function ProcessoQuickStats({ processoId, fase, modoCliente }) {
  return (
    <div className="space-y-4">
      <ProcessoResumoExecutivo processoId={processoId} modoCliente={modoCliente} />
      <ProcessoProgressBar fase={fase || 'inicial'} />
    </div>
  );
}