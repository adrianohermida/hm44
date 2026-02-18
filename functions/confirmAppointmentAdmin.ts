import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Admin confirma, rejeita ou recoloca agendamento
 * - Cria evento no Google Calendar do Dr. Adriano
 * - Notifica cliente
 * - Atualiza status bilateral
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const payload = await req.json();
    const { appointment_id, action, new_data } = payload;
    // action: 'confirmar', 'rejeitar', 'remarcar'

    if (!appointment_id || !action) {
      return Response.json({ error: 'Dados faltando' }, { status: 400 });
    }

    // STEP 1: Buscar agendamento
    const [appointment] = await base44.asServiceRole.entities.Appointment.filter({
      id: appointment_id
    });

    if (!appointment) {
      return Response.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    // STEP 2: Processar ação
    if (action === 'confirmar') {
      // Criar evento no Google Calendar
      const googleAccessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
      
      const appointmentTypes = await base44.asServiceRole.entities.AppointmentType.list();
      const drProfile = appointmentTypes.find(t => t.doctor_email === 'adriano@example.com');
      
      const startDateTime = new Date(`${appointment.data}T${appointment.hora}:00`);
      const endDateTime = new Date(startDateTime.getTime() + (drProfile?.duracao_minutos || 60) * 60 * 1000);

      const event = {
        summary: `Consulta - ${appointment.cliente_nome}`,
        description: appointment.descricao || '',
        start: { dateTime: startDateTime.toISOString() },
        end: { dateTime: endDateTime.toISOString() },
        attendees: [
          { email: appointment.cliente_email },
          { email: 'adriano@example.com' }
        ]
      };

      const googleRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${drProfile.google_calendar_id}/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        }
      );

      if (!googleRes.ok) {
        throw new Error(`Google Calendar error: ${googleRes.statusText}`);
      }

      const googleEvent = await googleRes.json();

      // Atualizar appointment como confirmado
      await base44.asServiceRole.entities.Appointment.update(appointment_id, {
        status: 'confirmado',
        google_event_id: googleEvent.id,
        confirmado_em: new Date().toISOString(),
        confirmado_por: user.email
      });

      // Notificar cliente
      await base44.integrations.Core.SendEmail({
        to: appointment.cliente_email,
        subject: `Agendamento confirmado - ${appointment.data} às ${appointment.hora}`,
        body: `
Sua consulta foi confirmada!

Data: ${appointment.data}
Hora: ${appointment.hora}
Tipo: ${appointment.tipo_agendamento}

Para cancelar ou remarcar, entre em contato conosco.
        `
      });

    } else if (action === 'rejeitar') {
      await base44.asServiceRole.entities.Appointment.update(appointment_id, {
        status: 'rejeitado',
        rejeitado_em: new Date().toISOString(),
        rejeitado_por: user.email
      });

      await base44.integrations.Core.SendEmail({
        to: appointment.cliente_email,
        subject: `Solicitação de agendamento rejeitada`,
        body: `Sua solicitação de agendamento foi rejeitada. Entre em contato para agendar novamente.`
      });

    } else if (action === 'remarcar') {
      // Validar novo slot disponível
      if (!new_data?.data || !new_data?.hora) {
        return Response.json({ error: 'Nova data/hora necessária' }, { status: 400 });
      }

      await base44.asServiceRole.entities.Appointment.update(appointment_id, {
        data: new_data.data,
        hora: new_data.hora,
        status: 'pendente_confirmacao',
        remarcado_em: new Date().toISOString()
      });

      await base44.integrations.Core.SendEmail({
        to: appointment.cliente_email,
        subject: `Agendamento remarcado`,
        body: `Seu agendamento foi remarcado para ${new_data.data} às ${new_data.hora}`
      });
    }

    return Response.json({ success: true, status: action });

  } catch (error) {
    console.error('Confirm appointment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});