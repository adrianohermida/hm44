import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import HeroBanner from '@/components/event/HeroBanner';
import RegistrationForm from '@/components/event/RegistrationForm';
import EventSchedule from '@/components/event/EventSchedule';
import SpeakerList from '@/components/event/SpeakerList';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function EventLanding() {
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [location.search]);

  const loadEvent = async () => {
    const params = new URLSearchParams(location.search);
    const eventId = params.get('id');
    
    if (eventId) {
      try {
        const data = await base44.entities.StudentEvent.get(eventId);
        setEvent(data);
      } catch (error) {
        toast.error('Evento não encontrado');
      }
    }
  };

  const handleRegister = async (formData) => {
    setIsSubmitting(true);
    try {
      await base44.entities.StudentEvent.create({
        ...formData,
        event_id: event.id,
        status: 'registered',
        registration_date: new Date().toISOString()
      });
      toast.success('Inscrição realizada com sucesso!');
      setShowForm(false);
    } catch (error) {
      toast.error('Erro ao realizar inscrição');
    }
    setIsSubmitting(false);
  };

  if (!event) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <HeroBanner event={event} onRegisterClick={() => setShowForm(true)} />

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {showForm && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Inscreva-se no Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <RegistrationForm onSubmit={handleRegister} isSubmitting={isSubmitting} />
            </CardContent>
          </Card>
        )}

        {event.programacao && (
          <section>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center">
              Programação
            </h2>
            <EventSchedule schedule={event.programacao} />
          </section>
        )}

        {event.palestrantes && event.palestrantes.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center">
              Palestrantes
            </h2>
            <SpeakerList speakers={event.palestrantes} />
          </section>
        )}
      </div>
    </div>
  );
}