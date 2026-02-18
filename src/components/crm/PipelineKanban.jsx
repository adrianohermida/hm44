import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, Percent } from 'lucide-react';
import { toast } from 'sonner';
import OportunidadeFormModal from './OportunidadeFormModal';

const STAGES = [
  { id: 'prospeccao', label: 'Prospecção', color: 'bg-gray-100' },
  { id: 'qualificacao', label: 'Qualificação', color: 'bg-blue-100' },
  { id: 'proposta', label: 'Proposta', color: 'bg-yellow-100' },
  { id: 'negociacao', label: 'Negociação', color: 'bg-orange-100' },
  { id: 'fechamento', label: 'Fechamento', color: 'bg-purple-100' },
  { id: 'ganho', label: 'Ganho', color: 'bg-green-100' }
];

export default function PipelineKanban() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingOp, setEditingOp] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: oportunidades = [], isLoading } = useQuery({
    queryKey: ['oportunidades'],
    queryFn: async () => {
      const data = await base44.entities.Oportunidade.filter({
        escritorio_id: user.escritorio_id
      });
      return data.filter(o => o.stage !== 'perdido');
    },
    enabled: !!user?.escritorio_id
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }) => base44.entities.Oportunidade.update(id, { stage }),
    onSuccess: () => {
      queryClient.invalidateQueries(['oportunidades']);
      toast.success('Oportunidade movida');
    }
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    updateStageMutation.mutate({ id: draggableId, stage: destination.droppableId });
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]" /></div>;
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageOps = oportunidades.filter(o => o.stage === stage.id);
            const totalValue = stageOps.reduce((sum, o) => sum + (o.valor_estimado || 0), 0);

            return (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-w-[280px] flex-shrink-0"
                  >
                    <Card className={`${stage.color} h-full`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold">{stage.label}</CardTitle>
                          <span className="text-xs font-bold bg-white/70 px-2 py-1 rounded">{stageOps.length}</span>
                        </div>
                        <div className="text-xs text-gray-700 mt-1">{formatMoney(totalValue)}</div>
                      </CardHeader>
                      <CardContent className="space-y-2 min-h-[400px]">
                        {stageOps.map((op, idx) => (
                          <Draggable key={op.id} draggableId={op.id} index={idx}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-3 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
                                onClick={() => { setEditingOp(op); setShowForm(true); }}
                              >
                                <h4 className="font-semibold text-sm text-gray-900">{op.titulo}</h4>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  <span>{formatMoney(op.valor_estimado)}</span>
                                </div>
                                {op.probabilidade && (
                                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                                    <Percent className="w-3 h-3" />
                                    <span>{op.probabilidade}%</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-[var(--brand-primary)]"
        onClick={() => setShowForm(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <OportunidadeFormModal
        oportunidade={editingOp}
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingOp(null);
        }}
      />
    </>
  );
}