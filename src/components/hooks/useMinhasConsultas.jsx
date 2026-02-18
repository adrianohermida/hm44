import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useGoogleCalendar } from './useGoogleCalendar';

export function useMinhasConsultas() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { updateEvent, deleteEvent } = useGoogleCalendar();

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const loadAgendamentos = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const escritorios = await base44.entities.Escritorio.list();
      const escritorioId = escritorios[0]?.id;
      if (!escritorioId) { setAgendamentos([]); setLoading(false); return; }

      const dbAgendamentos = await base44.entities.Audiencia.filter({
        escritorio_id: escritorioId,
        advogado_responsavel_id: user.id
      }, '-data_hora');

      const googleEvents = await loadGoogleCalendarEvents(user);
      const merged = mergeAgendamentos(dbAgendamentos, googleEvents, escritorioId);
      setAgendamentos(merged);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAgendamentos([]);
    }
    setLoading(false);
  };

  const loadGoogleCalendarEvents = async (user) => {
    try {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(now.getMonth() + 3);

      const response = await base44.functions.invoke('getGoogleCalendarEvents', {
        timeMin: now.toISOString(),
        timeMax: endDate.toISOString()
      });

      return response.data?.events || [];
    } catch (error) {
      console.error('Erro ao buscar eventos do Google:', error);
      return [];
    }
  };

  const mergeAgendamentos = (dbItems, googleEvents, escritorioId) => {
    const merged = [...dbItems];
    const dbMap = new Map(dbItems.map(item => [item.google_event_id, item]));

    googleEvents.forEach(event => {
      if (!dbMap.has(event.id)) {
        merged.push({
          id: `google_${event.id}`,
          google_event_id: event.id,
          tipo: 'Evento Google',
          data_hora: event.start?.dateTime || event.start?.date,
          local: event.location || 'Online',
          status: 'agendada',
          pauta: event.summary,
          escritorio_id: escritorioId,
          from_google: true
        });
      }
    });

    return merged.sort((a, b) => {
      const dateA = new Date(a.data_hora);
      const dateB = new Date(b.data_hora);
      return isNaN(dateA) || isNaN(dateB) ? 0 : dateB - dateA;
    });
  };

  const remarcarAgendamento = async (agendamento, novaData, novaHora) => {
    const dataHora = new Date(`${novaData}T${novaHora}`);
    const endTime = new Date(dataHora.getTime() + 60 * 60 * 1000);

    try {
      if (agendamento.google_event_id) {
        const result = await updateEvent(agendamento.google_event_id, {
          summary: `Consulta: ${agendamento.tipo}`,
          description: agendamento.pauta,
          start: dataHora.toISOString(),
          end: endTime.toISOString(),
          reminderMinutes: 30
        });
        if (!result?.success) throw new Error('Falha ao atualizar evento Google');
      }

      if (agendamento.id && !agendamento.from_google) {
        await base44.entities.Audiencia.update(agendamento.id, {
          data_hora: dataHora.toISOString(),
          status: 'agendada'
        });
      }

      await loadAgendamentos();
    } catch (error) {
      console.error('Erro ao remarcar:', error);
      throw error;
    }
  };

  const cancelarAgendamento = async (agendamento, motivo) => {
    try {
      if (agendamento.google_event_id) {
        const result = await deleteEvent(agendamento.google_event_id);
        if (!result?.success) throw new Error('Falha ao deletar evento Google');
      }

      if (agendamento.id && !agendamento.from_google) {
        await base44.entities.Audiencia.update(agendamento.id, {
          status: 'cancelada',
          observacoes: motivo || 'Cancelado pelo cliente'
        });
      }

      await loadAgendamentos();
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      throw error;
    }
  };

  return { agendamentos, loading, remarcarAgendamento, cancelarAgendamento };
}