import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const PendenciaCheckboxItem = ({ tarefa, onToggle }) => (
  <div className="flex items-center gap-2 p-2 hover:bg-[var(--bg-secondary)] rounded">
    <Checkbox
      checked={tarefa.status === 'concluida'}
      onCheckedChange={() => onToggle(tarefa)}
    />
    <span className={`text-sm flex-1 ${tarefa.status === 'concluida' ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'}`}>
      {tarefa.titulo}
    </span>
  </div>
);

export default function PendenciasCard({ clienteId, escritorioId, onAdicionar }) {
  const queryClient = useQueryClient();

  const { data: tarefas = [], isLoading } = useQuery({
    queryKey: ['tarefas-cliente', clienteId],
    queryFn: async () => {
      const data = await base44.entities.Tarefa.filter({
        cliente_id: clienteId,
        escritorio_id: escritorioId
      }, '-created_date', 10);
      return data;
    },
    enabled: !!clienteId && !!escritorioId
  });

  const toggleMutation = useMutation({
    mutationFn: async (tarefa) => {
      const novoStatus = tarefa.status === 'concluida' ? 'pendente' : 'concluida';
      return await base44.entities.Tarefa.update(tarefa.id, { status: novoStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tarefas-cliente']);
      toast.success('Status atualizado');
    }
  });

  if (isLoading) return null;
  if (tarefas.length === 0) return null;

  const pendentes = tarefas.filter(t => t.status !== 'concluida');

  return (
    <Card className="bg-white dark:bg-[var(--bg-elevated)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            PENDÊNCIAS ({pendentes.length})
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={onAdicionar} className="h-8 w-8 p-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {tarefas.slice(0, 5).map(tarefa => (
          <PendenciaCheckboxItem
            key={tarefa.id}
            tarefa={tarefa}
            onToggle={toggleMutation.mutate}
          />
        ))}
      </CardContent>
    </Card>
  );
}