import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import TarefaItem from './TarefaItem';
import TarefaFormInline from './TarefaFormInline';

export default function ProcessoTarefasList({ processoId, onAdd }) {
  const [showForm, setShowForm] = React.useState(false);
  const { data: tarefas = [] } = useQuery({
    queryKey: ['tarefas-processo', processoId],
    queryFn: () => base44.entities.TarefaProcesso.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  const pendentes = tarefas.filter(t => t.status === 'pendente' || t.status === 'em_andamento');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />Tarefas ({pendentes.length})
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {showForm && <TarefaFormInline onSave={(data) => {onAdd(data); setShowForm(false);}} onCancel={() => setShowForm(false)} />}
        {pendentes.length === 0 && !showForm ? (
          <p className="text-sm text-[var(--text-secondary)]">Nenhuma tarefa pendente</p>
        ) : (
          pendentes.map(tarefa => <TarefaItem key={tarefa.id} tarefa={tarefa} />)
        )}
      </CardContent>
    </Card>
  );
}