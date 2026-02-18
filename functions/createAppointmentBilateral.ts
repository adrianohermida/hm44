import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Cria agendamento bilateral:
 * 1. Cliente cria via MeuPainel
 * 2. Admin aprova/confirma/rejeita via Dashboard
 * 3. Sincroniza com Google Calendar do Dr. Adriano
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const {
      cliente_nome,
      cliente_email,
      cliente_telefone,
      data,
      hora,
      tipo_agendamento,
      descricao
    } = payload;

    // Validar campos obrigatórios
    if (!cliente_nome || !data || !hora) {
      return Response.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // STEP 1: Validar disponibilidade
    const availabilities = await base44.asServiceRole.entities.CalendarAvailability.filter({
      doctor_email: 'adriano@example.com'
    });

    const slotBooked = availabilities.some(av => {
      const slots = JSON.parse(av.slots_json || '[]');
      return slots.some(s => s.date === data && s.time === hora && s.available);
    });

    if (!slotBooked) {
      return Response.json({ error: 'Horário não disponível' }, { status: 409 });
    }

    // STEP 2: Criar agendamento em status "pendente_confirmacao"
    const appointment = await base44.asServiceRole.entities.Appointment.create({
      cliente_nome,
      cliente_email,
      cliente_telefone,
      data,
      hora,
      tipo_agendamento: tipo_agendamento || 'consultoria',
      descricao,
      status: 'pendente_confirmacao', // Admin vai confirmar
      created_by: user.email,
      escritorio_id: (await base44.asServiceRole.entities.Escritorio.list())[0]?.id
    });

    // STEP 3: Notificar admin para aprovar
    try {
      await base44.integrations.Core.SendEmail({
        to: 'admin@escritorio.com.br', // Email do admin
        subject: `Nova solicitação de agendamento - ${cliente_nome}`,
        body: `
Novo agendamento solicitado:
- Cliente: ${cliente_nome}
- Data: ${data}
- Hora: ${hora}
- Email: ${cliente_email}
- Telefone: ${cliente_telefone}

Tipo: ${tipo_agendamento}
Descrição: ${descricao}

Acesse o Dashboard para confirmar, remarcar ou cancelar.
        `
      });
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Continua mesmo se falhar envio de email
    }

    return Response.json({
      success: true,
      appointment_id: appointment.id,
      status: 'pendente_confirmacao'
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});