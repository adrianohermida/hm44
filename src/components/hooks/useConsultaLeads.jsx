import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useGoogleCalendar } from './useGoogleCalendar';

export function useConsultaLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('todos');
  const { createEvent } = useGoogleCalendar();

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    setLoading(true);
    const query = filter === 'todos' ? {} : { status: filter };
    const result = await base44.entities.Lead.filter({ 
      ...query, 
      area_interesse: 'consulta_agendamento' 
    }, '-created_date');
    setLeads(result);
    setLoading(false);
  };

  const aproveLead = async (lead) => {
    await base44.entities.Lead.update(lead.id, { status: 'aprovado' });
    await loadLeads();
  };

  const rejectLead = async (lead) => {
    await base44.entities.Lead.update(lead.id, { status: 'rejeitado' });
    await loadLeads();
  };

  const scheduleLead = async (lead) => {
    const { data, horario } = parseMessage(lead.mensagem);
    if (!data || !horario) return;

    const [day, month, year] = data.split('/');
    const [startTime] = horario.split(' - ');
    const startDate = new Date(`${year}-${month}-${day}T${startTime}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    await createEvent({
      summary: `Consulta: ${lead.nome}`,
      description: lead.mensagem,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      reminderMinutes: 30
    });

    await base44.entities.Lead.update(lead.id, { status: 'agendado' });
    await loadLeads();
  };

  const parseMessage = (msg) => {
    const lines = msg?.split('\n') || [];
    const data = lines.find(l => l.startsWith('Data:'))?.replace('Data:', '').trim();
    const horario = lines.find(l => l.startsWith('Horário:'))?.replace('Horário:', '').trim();
    return { data, horario };
  };

  return { leads, loading, filter, setFilter, aproveLead, rejectLead, scheduleLead };
}