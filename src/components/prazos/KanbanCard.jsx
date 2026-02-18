import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function KanbanCard({ prazo, index }) {
  const diasRestantes = Math.ceil(
    (new Date(prazo.data_vencimento) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isUrgente = diasRestantes <= 3;

  return (
    <Draggable draggableId={prazo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            className={`mb-2 cursor-move ${
              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
            } ${isUrgente ? 'border-red-500' : ''}`}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium flex-1">{prazo.titulo}</p>
                {isUrgente && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-tertiary)]">
                <Clock className="w-3 h-3" />
                {format(new Date(prazo.data_vencimento), 'dd/MM/yyyy')}
                <Badge variant="secondary" className="text-xs">
                  {diasRestantes}d
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}