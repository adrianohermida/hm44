import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date } = await req.json();
    const targetDate = new Date(date);
    
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    if (!accessToken) {
      return Response.json({ slots: [], error: 'Calendar not connected' });
    }

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(8, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(18, 0, 0, 0);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const data = await response.json();
    const busyEvents = data.items || [];

    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      const slotTime = new Date(targetDate);
      slotTime.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(slotTime);
      slotEnd.setHours(hour + 1);

      const isBusy = busyEvents.some(event => {
        const eventStart = new Date(event.start.dateTime || event.start.date);
        const eventEnd = new Date(event.end.dateTime || event.end.date);
        return slotTime < eventEnd && slotEnd > eventStart;
      });

      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`,
        status: isBusy ? 'busy' : 'available',
        start: slotTime.toISOString()
      });
    }

    return Response.json({ slots, success: true });
  } catch (error) {
    return Response.json({ error: error.message, slots: [] }, { status: 500 });
  }
});