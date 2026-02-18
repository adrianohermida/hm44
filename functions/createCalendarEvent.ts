import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { summary, description, startTime, endTime, attendeeEmail } = await req.json();

    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    if (!accessToken) {
      return Response.json({ error: 'Calendar not connected' }, { status: 400 });
    }

    const event = {
      summary,
      description: `${description}\n\n⚠️ PENDENTE DE APROVAÇÃO DO ADVOGADO`,
      start: { dateTime: startTime, timeZone: 'America/Sao_Paulo' },
      end: { dateTime: endTime, timeZone: 'America/Sao_Paulo' },
      attendees: attendeeEmail ? [{ email: attendeeEmail }] : [],
      status: 'tentative'
    };

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }
    );

    const data = await response.json();

    await base44.asServiceRole.entities.Atendimento.create({
      cliente_email: attendeeEmail || user.email,
      cliente_nome: user.full_name,
      tipo: 'consulta',
      data_hora: startTime,
      status: 'pendente_aprovacao',
      observacoes: `Criado pelo assistente virtual: ${description}`,
      escritorio_id: user.escritorio_id,
      calendar_event_id: data.id
    });

    return Response.json({ success: true, eventId: data.id, message: 'Consulta criada (pendente de aprovação)' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});