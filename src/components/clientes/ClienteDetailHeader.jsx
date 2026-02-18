import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, MoreVertical } from 'lucide-react';
import ClienteStatusBadge from './ClienteStatusBadge';

export default function ClienteDetailHeader({ cliente, onVoltar, onEditar }) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Button variant="ghost" onClick={onVoltar} className="mb-2 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />Voltar
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{cliente.nome_completo}</h1>
          <ClienteStatusBadge status={cliente.status} />
        </div>
        <p className="text-[var(--text-secondary)]">{cliente.email || 'Sem e-mail cadastrado'}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onEditar} className="bg-[var(--brand-primary)]">
          <Edit className="w-4 h-4 mr-2" />Editar
        </Button>
      </div>
    </div>
  );
}