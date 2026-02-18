import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import TarefaFormInline from './TarefaFormInline';
import useClientePermissions from '@/components/hooks/useClientePermissions';

export default function ProcessoTarefasCard({ processoId, modo }) {
  const permissions = useClientePermissions(modo);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: tarefas = [] } = useQuery({
    queryKey: ['tarefas-processo', processoId],
    queryFn: async () => {
      const user = await base44.auth.me();
      const query = { 
        processo_id: processoId,
        escritorio_id: user.escritorio_id
      };
      
      if (!permissions.canSeeAllTarefas) {
        query.compartilhado_cliente = true;
      }
      
      return base44.entities.TarefaProcesso.filter(query);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.TarefaProcesso.update(id, { 
      status, 
      data_conclusao: status === 'concluida' ? new Date().toISOString() : null 
    }),
    onSuccess: () => queryClient.invalidateQueries(['tarefas-processo'])
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.TarefaProcesso.create({
        ...data,
        escritorio_id: user.escritorio_id,
        processo_id: processoId,
        status: 'pendente',
        prioridade: 'media',
        compartilhado_cliente: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tarefas-processo']);
      setShowForm(false);
      toast.success('Tarefa criada');
    }
  });

  const pendentes = tarefas.filter(t => t.status !== 'concluida');
  const concluidas = tarefas.filter(t => t.status === 'concluida');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />Tarefas
          {pendentes.length > 0 && <Badge variant="outline">{pendentes.length}</Badge>}
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {showForm && <TarefaFormInline onSave={createMutation.mutate} onCancel={() => setShowForm(false)} />}
        {pendentes.map(tarefa => (
          <div key={tarefa.id} className="flex items-start gap-2 p-2 rounded hover:bg-[var(--bg-secondary)]">
            <Checkbox onCheckedChange={() => updateMutation.mutate({ id: tarefa.id, status: 'concluida' })} />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{tarefa.titulo}</p>
              {tarefa.responsavel_email && (
                <p className="text-xs text-[var(--text-tertiary)]">@{tarefa.responsavel_email.split('@')[0]}</p>
              )}
            </div>
          </div>
        ))}
        {concluidas.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setShowCompleted(!showCompleted)} className="w-full">
            {showCompleted ? 'Ocultar' : 'Ver'} concluídas ({concluidas.length})
          </Button>
        )}
        {showCompleted && concluidas.map(tarefa => (
          <div key={tarefa.id} className="flex items-start gap-2 p-2 rounded opacity-60">
            <Checkbox checked disabled />
            <p className="text-sm line-through truncate flex-1">{tarefa.titulo}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}