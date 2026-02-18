import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ status, title, prazos, color }) {
  const count = prazos?.length || 0;

  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>{title}</span>
          <Badge
            className={`${color} text-white`}
            style={{ backgroundColor: `var(${color})` }}
          >
            {count}
          </Badge>
        </CardTitle>
      </CardHeader>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <CardContent
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[400px] ${
              snapshot.isDraggingOver ? 'bg-[var(--bg-tertiary)]' : ''
            }`}
          >
            {prazos?.map((prazo, index) => (
              <KanbanCard key={prazo.id} prazo={prazo} index={index} />
            ))}
            {provided.placeholder}
          </CardContent>
        )}
      </Droppable>
    </Card>
  );
}