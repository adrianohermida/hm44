import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TarefasTicketList({ ticketId, processoId }) {
  const navigate = useNavigate();

  const { data: tarefas = [] } = useQuery({
    queryKey: ['tarefas-ticket', processoId],
    queryFn: () => base44.entities.Tarefa.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  const tarefasPendentes = tarefas.filter(t => t.status !== 'concluida');

  return (
    <div className="border-t border-[var(--border-primary)] p-4 space-y-3">
      <Button
        variant="link"
        onClick={() => navigate(`${createPageUrl('Tarefas')}${processoId ? `?processo_id=${processoId}` : ''}`)}
        className="text-sm text-[var(--brand-primary)] p-0 h-auto"
      >
        + Adicionar tarefa
      </Button>

      {tarefasPendentes.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-4">
          Nenhuma tarefa pendente
        </p>
      ) : (
        <div className="space-y-2">
          {tarefasPendentes.map(tarefa => (
            <div 
              key={tarefa.id}
              className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`${createPageUrl('Tarefas')}?tarefa_id=${tarefa.id}`)}
            >
              <div className="flex-shrink-0 mt-0.5">
                {tarefa.status === 'concluida' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">
                  {tarefa.titulo}
                </p>
                {tarefa.data_vencimento && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(tarefa.data_vencimento), 'dd MMM', { locale: ptBR })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}