import { useState } from 'react';
import { base44 } from '@/api/base44Client';

export function useGoogleCalendar() {
  const [loading, setLoading] = useState(false);

  const getAccessToken = async () => {
    return await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
  };

  const createEvent = async (event) => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const reminderMinutes = event.reminderMinutes || 30;
      const reminders = reminderMinutes > 0 ? {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: reminderMinutes },
          { method: 'popup', minutes: reminderMinutes }
        ]
      } : { useDefault: false, overrides: [] };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.summary,
          description: event.description,
          start: { dateTime: event.start },
          end: { dateTime: event.end },
          location: event.location,
          reminders
        })
      });
      const data = await response.json();
      return { success: true, eventId: data.id };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId, event) => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const reminderMinutes = event.reminderMinutes !== undefined ? event.reminderMinutes : 30;
      const reminders = reminderMinutes > 0 ? {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: reminderMinutes },
          { method: 'popup', minutes: reminderMinutes }
        ]
      } : { useDefault: false, overrides: [] };

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.summary,
          description: event.description,
          start: { dateTime: event.start },
          end: { dateTime: event.end },
          location: event.location,
          reminders
        })
      });
      const data = await response.json();
      return { success: true, eventId: data.id };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const getAvailability = async (date) => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const timeMin = new Date(date).toISOString();
      const timeMax = new Date(new Date(date).setHours(23, 59, 59)).toISOString();
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      return { success: true, events: data.items || [] };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, updateEvent, deleteEvent, getAvailability, loading };
}