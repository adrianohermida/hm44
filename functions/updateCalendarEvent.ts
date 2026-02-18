import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId, startTime, endTime, summary, description } = await req.json();

    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    if (!accessToken) {
      return Response.json({ error: 'Calendar not connected' }, { status: 400 });
    }

    const updateData = {
      start: { dateTime: startTime, timeZone: 'America/Sao_Paulo' },
      end: { dateTime: endTime, timeZone: 'America/Sao_Paulo' },
      status: 'tentative'
    };

    if (summary) updateData.summary = summary;
    if (description) updateData.description = `${description}\n\n⚠️ REMARCADO - PENDENTE DE APROVAÇÃO`;

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      }
    );

    return Response.json({ success: true, message: 'Evento atualizado (pendente de aprovação)' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});