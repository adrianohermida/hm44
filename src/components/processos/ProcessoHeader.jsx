import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import ProcessoStatus from './ProcessoStatus';

export default function ProcessoHeader({ processo, onVoltar, onEditar }) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onVoltar} className="-ml-2">
        <ArrowLeft className="w-4 h-4 mr-2" />Voltar
      </Button>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{processo.numero_cnj}</h1>
          <p className="text-[var(--text-secondary)] mt-1">{processo.tribunal}</p>
        </div>
        <div className="flex gap-2">
          <ProcessoStatus status={processo.status} />
          <Button onClick={onEditar}><Edit className="w-4 h-4 mr-2" />Editar</Button>
        </div>
      </div>
    </div>
  );
}