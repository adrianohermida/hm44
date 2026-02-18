import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ResumeLoader from '@/components/common/ResumeLoader';
import EventDetailsHeader from '@/components/eventDetails/EventDetailsHeader';
import EventDetailsInfo from '@/components/eventDetails/EventDetailsInfo';
import EventActions from '@/components/eventDetails/EventActions';

export default function EventDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [location.search]);

  const loadEvent = async () => {
    const params = new URLSearchParams(location.search);
    const eventId = params.get('id');
    
    if (!eventId) {
      navigate(createPageUrl('AgendaSemanal'));
      return;
    }

    try {
      const data = await base44.entities.Audiencia.get(eventId);
      setEvent(data);
    } catch (error) {
      toast.error('Erro ao carregar evento');
      navigate(createPageUrl('AgendaSemanal'));
    }
    setLoading(false);
  };

  const handleEdit = (event) => {
    navigate(createPageUrl('AgendaSemanal') + `?edit=${event.id}`);
  };

  const handleDelete = async (event) => {
    if (!confirm('Deseja realmente cancelar este evento?')) return;
    
    try {
      await base44.entities.Audiencia.update(event.id, { status: 'cancelada' });
      toast.success('Evento cancelado');
      navigate(createPageUrl('AgendaSemanal'));
    } catch (error) {
      toast.error('Erro ao cancelar evento');
    }
  };

  const handleComplete = async (event) => {
    try {
      await base44.entities.Audiencia.update(event.id, { status: 'realizada' });
      toast.success('Evento marcado como realizado');
      loadEvent();
    } catch (error) {
      toast.error('Erro ao atualizar evento');
    }
  };

  if (loading) return <ResumeLoader />;
  if (!event) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[
          { label: 'Agenda', url: createPageUrl('AgendaSemanal') },
          { label: 'Detalhes do Evento' }
        ]} />

        <EventDetailsHeader event={event} />
        <EventDetailsInfo event={event} />
        
        <div className="mt-6">
          <EventActions 
            event={event}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}