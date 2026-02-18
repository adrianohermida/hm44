import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useGoogleCalendar } from '@/components/hooks/useGoogleCalendar';
import WeeklySchedule from './WeeklySchedule';
import ReminderSettings from './ReminderSettings';
import DoubleBookingAlert from './DoubleBookingAlert';
import NotesModal from './schedule/NotesModal';

export default function WeeklyScheduleManager() {
  const [schedule, setSchedule] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [reminderTime, setReminderTime] = useState('30');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventsMap, setEventsMap] = useState({});
  const { getAvailability, updateEvent } = useGoogleCalendar();

  useEffect(() => {
    loadWeeklySchedule();
  }, []);

  const loadWeeklySchedule = async () => {
    const days = [];
    const tempEventsMap = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const result = await getAvailability(date.toISOString());
      
      if (result.success) {
        const dayItems = result.events.map(e => {
          const eventId = e.id;
          tempEventsMap[eventId] = e;
          const hasReminder = e.reminders?.useDefault === false && 
                             e.reminders?.overrides?.length > 0;
          return {
            id: eventId,
            time: new Date(e.start.dateTime || e.start.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            title: e.summary,
            hasReminder: hasReminder,
            notes: e.description || ''
          };
        });
        
        days.push({
          date: date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' }),
          items: dayItems
        });
      }
    }
    
    setSchedule(days);
    setEventsMap(tempEventsMap);
    detectConflicts(days);
  };

  const detectConflicts = (days) => {
    const allEvents = days.flatMap(d => d.items);
    const conflicts = allEvents.filter((e, i) => 
      allEvents.some((other, j) => i !== j && e.time === other.time)
    );
    setConflicts(conflicts);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleSaveNotes = async (event, notes) => {
    const gcEvent = eventsMap[event.id];
    if (gcEvent) {
      await updateEvent(event.id, {
        summary: gcEvent.summary,
        description: notes,
        start: gcEvent.start.dateTime || gcEvent.start.date,
        end: gcEvent.end.dateTime || gcEvent.end.date,
        location: gcEvent.location
      });
      await loadWeeklySchedule();
    }
  };

  const handleReminderChange = async (minutes) => {
    setReminderTime(minutes);
    await base44.auth.updateMe({ reminder_default_minutes: parseInt(minutes) });
  };

  const handleApplyRemindersToAll = async () => {
    const minutes = parseInt(reminderTime);
    
    for (const [eventId, gcEvent] of Object.entries(eventsMap)) {
      await updateEvent(eventId, {
        summary: gcEvent.summary,
        description: gcEvent.description,
        start: gcEvent.start.dateTime || gcEvent.start.date,
        end: gcEvent.end.dateTime || gcEvent.end.date,
        location: gcEvent.location,
        reminderMinutes: minutes
      });
    }
    
    await loadWeeklySchedule();
  };

  const totalEvents = Object.keys(eventsMap).length;

  return (
    <div className="space-y-4">
      <ReminderSettings 
        value={reminderTime} 
        onChange={handleReminderChange}
        onApplyToAll={handleApplyRemindersToAll}
        eventCount={totalEvents}
        applying={false}
      />
      <DoubleBookingAlert conflicts={conflicts} />
      <WeeklySchedule events={schedule} onSelectEvent={handleSelectEvent} />
      <NotesModal 
        event={selectedEvent}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNotes}
      />
    </div>
  );
}