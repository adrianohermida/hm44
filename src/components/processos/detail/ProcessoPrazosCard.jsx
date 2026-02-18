import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';
import PrazoItem from './PrazoItem';
import PrazoFormInline from './PrazoFormInline';
import useClientePermissions from '@/components/hooks/useClientePermissions';

export default function ProcessoPrazosCard({ processoId, modo }) {
  const permissions = useClientePermissions(modo);
  
  if (!permissions.canSeePrazos) return null;
  const [showCompleted, setShowCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: prazos = [] } = useQuery({
    queryKey: ['prazos-processo', processoId],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.TarefaProcesso.filter({ 
        processo_id: processoId,
        escritorio_id: user.escritorio_id,
        tipo: 'prazo_processual' 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.TarefaProcesso.update(id, { 
      status, 
      data_conclusao: status === 'concluida' ? new Date().toISOString() : null 
    }),
    onSuccess: () => queryClient.invalidateQueries(['prazos-processo'])
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.TarefaProcesso.create({
        ...data,
        escritorio_id: user.escritorio_id,
        processo_id: processoId,
        tipo: 'prazo_processual',
        status: 'pendente',
        prioridade: 'alta'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prazos-processo']);
      setShowForm(false);
      toast.success('Prazo criado');
    }
  });

  const pendentes = prazos.filter(p => p.status !== 'concluida');
  const concluidos = prazos.filter(p => p.status === 'concluida');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />Prazos
          {pendentes.length > 0 && <Badge variant="destructive">{pendentes.length}</Badge>}
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {showForm && <PrazoFormInline onSave={createMutation.mutate} onCancel={() => setShowForm(false)} />}
        {pendentes.map(prazo => (
          <PrazoItem
            key={prazo.id}
            prazo={prazo}
            onToggle={() => updateMutation.mutate({ id: prazo.id, status: 'concluida' })}
          />
        ))}
        {concluidos.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setShowCompleted(!showCompleted)} className="w-full">
            {showCompleted ? 'Ocultar' : 'Ver'} concluídos ({concluidos.length})
          </Button>
        )}
        {showCompleted && concluidos.map(prazo => (
          <PrazoItem
            key={prazo.id}
            prazo={prazo}
            completed
          />
        ))}
      </CardContent>
    </Card>
  );
}