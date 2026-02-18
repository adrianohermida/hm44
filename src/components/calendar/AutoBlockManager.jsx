import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useGoogleCalendar } from '@/components/hooks/useGoogleCalendar';
import AutoBlockToggle from './AutoBlockToggle';

export default function AutoBlockManager({ enabled, onToggle, escritorioId }) {
  const { getAvailability, createEvent } = useGoogleCalendar();

  useEffect(() => {
    if (enabled) {
      syncBlocks();
      const interval = setInterval(syncBlocks, 300000);
      return () => clearInterval(interval);
    }
  }, [enabled]);

  useEffect(() => {
    saveEnabledState();
  }, [enabled]);

  const saveEnabledState = async () => {
    await base44.auth.updateMe({
      google_auto_block_enabled: enabled
    });
  };

  const syncBlocks = async () => {
    await readGoogleEventsAndBlock();
    await createGoogleBlocksFromApp();
  };

  const readGoogleEventsAndBlock = async () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const result = await getAvailability(today.toISOString());
    
    if (result?.success) {
      for (const gcEvent of result.events) {
        const eventStart = new Date(gcEvent.start.dateTime || gcEvent.start.date);
        const eventEnd = new Date(gcEvent.end.dateTime || gcEvent.end.date);
        
        const existing = await base44.entities.CalendarAvailability.filter({
          google_event_id: gcEvent.id
        });

        if (existing.length === 0) {
          await base44.entities.CalendarAvailability.create({
            advogado_id: escritorioId,
            data: eventStart.toISOString().split('T')[0],
            horario_inicio: eventStart.toTimeString().slice(0, 5),
            horario_fim: eventEnd.toTimeString().slice(0, 5),
            disponivel: false,
            bloqueio_tipo: 'pessoal',
            google_event_id: gcEvent.id,
            escritorio_id: escritorioId
          });
        }
      }
    }
  };

  const createGoogleBlocksFromApp = async () => {
    const audiencias = await base44.entities.Audiencia.filter({
      escritorio_id: escritorioId,
      status: 'agendada'
    });

    for (const audiencia of audiencias) {
      const syncRecord = await base44.entities.CalendarSync.filter({
        entity_id: audiencia.id,
        entity_type: 'audiencia'
      });

      if (syncRecord.length === 0 || !syncRecord[0].google_event_id) {
        const eventStart = new Date(audiencia.data_hora);
        const eventEnd = new Date(eventStart.getTime() + (audiencia.duracao_prevista || 60) * 60000);

        const result = await createEvent({
          summary: `[BLOQUEADO] Audiência: ${audiencia.tipo}`,
          description: audiencia.pauta || 'Compromisso bloqueado automaticamente',
          start: eventStart.toISOString(),
          end: eventEnd.toISOString(),
          location: audiencia.local || ''
        });

        if (result.success) {
          await base44.entities.CalendarSync.create({
            google_event_id: result.eventId,
            entity_type: 'audiencia',
            entity_id: audiencia.id,
            sync_status: 'synced',
            last_sync: new Date().toISOString(),
            escritorio_id: escritorioId
          });
        }
      }
    }
  };

  return <AutoBlockToggle enabled={enabled} onToggle={onToggle} />;
}