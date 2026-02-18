import React from 'react';
import { base44 } from '@/api/base44Client';
import { useGoogleCalendar } from '@/components/hooks/useGoogleCalendar';
import TaskEventCreator from './TaskEventCreator';

export default function TaskCompletionSync({ task, onComplete }) {
  const { createEvent, loading } = useGoogleCalendar();

  const handleComplete = async () => {
    await base44.entities.Tarefa.update(task.id, {
      status: 'concluida',
      data_conclusao: new Date().toISOString()
    });

    const result = await createEvent({
      summary: `✓ Concluída: ${task.titulo}`,
      description: `Tarefa concluída com sucesso.\n${task.descricao || ''}`,
      start: new Date().toISOString(),
      end: new Date(Date.now() + 15 * 60000).toISOString(),
      location: 'Registro de conclusão'
    });

    if (result.success) {
      await base44.entities.CalendarSync.create({
        google_event_id: result.eventId,
        entity_type: 'tarefa',
        entity_id: task.id,
        sync_status: 'synced',
        escritorio_id: task.escritorio_id
      });
    }

    onComplete?.();
  };

  return <TaskEventCreator task={task} onCreateEvent={handleComplete} creating={loading} />;
}