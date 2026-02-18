import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId, reason } = await req.json();

    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    if (!accessToken) {
      return Response.json({ error: 'Calendar not connected' }, { status: 400 });
    }

    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );

    const atendimentos = await base44.asServiceRole.entities.Atendimento.filter({ 
      calendar_event_id: eventId 
    });
    
    if (atendimentos.length > 0) {
      await base44.asServiceRole.entities.Atendimento.update(atendimentos[0].id, {
        status: 'cancelado',
        observacoes: `${atendimentos[0].observacoes || ''}\n\nCancelado: ${reason}`
      });
    }

    return Response.json({ success: true, message: 'Evento cancelado' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});