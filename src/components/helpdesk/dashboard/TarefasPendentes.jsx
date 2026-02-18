import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TarefasPendentes({ tickets = [], onSelectTicket }) {
  const duasHorasAtras = new Date(Date.now() - 2 * 60 * 60 * 1000);
  
  const tarefas = tickets
    .filter(t => 
      ['aberto', 'em_atendimento'].includes(t.status) && 
      !t.tempo_primeira_resposta &&
      new Date(t.created_date) < duasHorasAtras
    )
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
    .slice(0, 5);

  if (tarefas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tarefas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Nenhum ticket aguardando resposta
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Tarefas Pendentes</CardTitle>
        <Badge variant="destructive">{tarefas.length}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {tarefas.map(tarefa => (
          <button
            key={tarefa.id}
            onClick={() => onSelectTicket(tarefa)}
            className="w-full text-left p-3 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {tarefa.titulo}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {tarefa.cliente_nome || tarefa.cliente_email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <AlertCircle className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-orange-600">
                    Sem resposta há {formatDistanceToNow(new Date(tarefa.created_date), { locale: ptBR })}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}