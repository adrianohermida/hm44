import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useGoogleCalendar } from './useGoogleCalendar';
import { buildEventData, markEntitySynced } from '../utils/calendarHelpers';

export function useCalendarSync() {
  const [syncing, setSyncing] = useState(false);
  const { createEvent, updateEvent } = useGoogleCalendar();

  const syncEvent = async (entity, entityType, escritorioId) => {
    setSyncing(true);
    try {
      const existing = await base44.entities.CalendarSync.filter({
        entity_id: entity.id,
        entity_type: entityType
      });

      const eventData = buildEventData(entity, entityType);
      let result;

      if (existing.length > 0 && existing[0].google_event_id) {
        result = await updateEvent(existing[0].google_event_id, eventData);
        if (result.success) {
          await base44.entities.CalendarSync.update(existing[0].id, {
            sync_status: 'synced',
            last_sync: new Date().toISOString()
          });
        }
      } else {
        result = await createEvent(eventData);
        if (result.success) {
          await base44.entities.CalendarSync.create({
            google_event_id: result.eventId,
            entity_type: entityType,
            entity_id: entity.id,
            sync_status: 'synced',
            last_sync: new Date().toISOString(),
            escritorio_id: escritorioId
          });
        }
      }

      if (result.success) {
        await markEntitySynced(entity.id, entityType);
      }

      return result;
    } catch (error) {
      return { success: false, error };
    } finally {
      setSyncing(false);
    }
  };

  return { syncEvent, syncing };
}