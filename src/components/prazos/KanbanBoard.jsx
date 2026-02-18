import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import KanbanEmptyState from './KanbanEmptyState';
import KanbanBoardSkeleton from './KanbanBoardSkeleton';
import { useKanbanMutations } from './hooks/useKanbanMutations';
import { useKanbanData } from './hooks/useKanbanData';

const COLUMNS = [
  { id: 'A Fazer', title: 'A Fazer', color: '--brand-primary-500' },
  { id: 'Em Andamento', title: 'Em Andamento', color: '--brand-warning' },
  { id: 'Concluído', title: 'Concluído', color: '--brand-success' }
];

export default function KanbanBoard() {
  const { updateStatusMutation } = useKanbanMutations();
  const { prazos, isLoading, getPrazosByStatus } = useKanbanData();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    updateStatusMutation.mutate({
      id: draggableId,
      status_kanban: destination.droppableId,
      ordem_kanban: destination.index
    });
  };

  if (isLoading) return <KanbanBoardSkeleton />;
  if (!prazos || prazos.length === 0) return <KanbanEmptyState />;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            status={col.id}
            title={col.title}
            prazos={getPrazosByStatus(col.id)}
            color={col.color}
          />
        ))}
      </div>
    </DragDropContext>
  );
}