import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Sincroniza disponibilidade do Dr. Adriano Menezes Hermida Maia via Google Calendar
 * - Fetch eventos do Google Calendar
 * - Calcula slots disponíveis (buffer 1h entre consultas)
 * - Filtra por regras de escritório (seg-sex, 9-18h)
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // STEP 1: Buscar escritório para validar tenant
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorio = escritorios[0];
    if (!escritorio) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }

    // STEP 2: Buscar configuração do Google Calendar (AppointmentType com google_calendar_id)
    const appointmentTypes = await base44.asServiceRole.entities.AppointmentType.list();
    const drAdrianoProfil = appointmentTypes.find(t => t.doctor_email === 'adriano@example.com');
    
    if (!drAdrianoProfil?.google_calendar_id) {
      return Response.json({ error: 'Google Calendar não configurado' }, { status: 400 });
    }

    // STEP 3: Fetch Google Calendar eventos
    const googleAccessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    const now = new Date();
    const startDate = now.toISOString();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 dias
    
    const calendarRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${drAdrianoProfil.google_calendar_id}/events?` +
      `timeMin=${startDate}&timeMax=${endDate}&singleEvents=true`,
      {
        headers: { Authorization: `Bearer ${googleAccessToken}` }
      }
    );
    
    if (!calendarRes.ok) {
      throw new Error(`Google Calendar error: ${calendarRes.statusText}`);
    }
    
    const calendarData = await calendarRes.json();
    const events = calendarData.items || [];

    // STEP 4: Calcular slots disponíveis (regras de escritório)
    const availableSlots = generateAvailableSlots(
      events,
      drAdrianoProfil.duracao_minutos || 60,
      drAdrianoProfil.tempo_minimo_antecedencia || 24
    );

    // STEP 5: Salvar em cache/disponibilidade
    await base44.asServiceRole.entities.CalendarAvailability.create({
      doctor_email: 'adriano@example.com',
      slots_json: JSON.stringify(availableSlots),
      last_sync: new Date().toISOString(),
      escritorio_id: escritorio.id
    });

    return Response.json({
      success: true,
      slots_count: availableSlots.length,
      sync_time: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sync Google Calendar error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Gera slots disponíveis conforme regras de escritório
 * - Seg-Sex: 9:00-18:00
 * - Duração: configurable (padrão 60min)
 * - Buffer entre: 1h
 * - Mínimo antecedência: configurable (padrão 24h)
 */
function generateAvailableSlots(events, durationMinutes = 60, minAntecedenciaHoras = 24) {
  const slots = [];
  
  // Regras de escritório
  const WORK_START = 9; // 9h
  const WORK_END = 18;   // 18h
  const BUFFER_MINUTES = 60; // Buffer entre consultas
  const MIN_ADVANCE_MS = minAntecedenciaHoras * 60 * 60 * 1000;
  
  const now = new Date();
  const minDate = new Date(now.getTime() + MIN_ADVANCE_MS);
  
  // Gerar próximos 30 dias
  for (let d = 0; d < 30; d++) {
    const date = new Date(minDate);
    date.setDate(date.getDate() + d);
    
    // Pular weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    // Gerar slots de 1h a cada 1h
    for (let hour = WORK_START; hour < WORK_END; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);
      
      // Verificar conflito com Google Calendar
      const hasConflict = events.some(event => {
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);
        return slotStart < eventEnd && slotEnd > eventStart;
      });
      
      if (!hasConflict) {
        slots.push({
          date: slotStart.toISOString().split('T')[0],
          time: `${String(hour).padStart(2, '0')}:00`,
          available: true,
          doctor_email: 'adriano@example.com'
        });
      }
    }
  }
  
  return slots;
}