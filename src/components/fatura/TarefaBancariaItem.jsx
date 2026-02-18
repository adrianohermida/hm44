import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function TarefaBancariaItem({ tarefa, onConferir }) {
  const statusColor = {
    PENDENTE: 'text-yellow-600',
    CONFERIDO: 'text-green-600',
    DIVERGENCIA: 'text-red-600'
  }[tarefa.status];

  return (
    <Card className="p-4 border-[var(--border-primary)]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {tarefa.status === 'PENDENTE' && <AlertCircle className="w-4 h-4 text-[var(--brand-warning)]" />}
            {tarefa.status === 'CONFERIDO' && <CheckCircle className="w-4 h-4 text-[var(--brand-success)]" />}
            <span className={`font-semibold ${statusColor}`}>{tarefa.status}</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Esperado: R$ {tarefa.valor_esperado?.toFixed(2)} | Recebido: R$ {tarefa.valor_recebido?.toFixed(2) || '---'}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            {new Date(tarefa.data_esperada).toLocaleDateString('pt-BR')}
          </p>
        </div>
        {tarefa.status === 'PENDENTE' && (
          <Button size="sm" onClick={() => onConferir(tarefa)} className="bg-[var(--brand-primary)]">
            Conferir
          </Button>
        )}
      </div>
    </Card>
  );
}