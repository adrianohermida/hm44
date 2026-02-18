import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import BookingHeader from './booking/BookingHeader';
import BookingFormFields from './booking/BookingFormFields';
import BookingValidator from './BookingValidator';
import ValidationGuard from './validation/ValidationGuard';

export default function ConsultaForm({ slot, date }) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', motivo: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setLoading(true);
    const horario = `${slot.start.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})} - ${slot.end.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
    
    await base44.entities.Lead.create({
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      mensagem: `Solicitação de Consulta\nData: ${new Date(date).toLocaleDateString('pt-BR')}\nHorário: ${horario}\nMotivo: ${form.motivo}`,
      origem: 'site',
      status: 'novo',
      escritorio_id: 'default',
      area_interesse: 'consulta_agendamento'
    });
    
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center p-6 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)]">
        <CheckCircle className="w-16 h-16 text-[var(--brand-success)] mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Solicitação Enviada!</h3>
        <p className="text-[var(--text-secondary)]">Entraremos em contato em breve para confirmar seu horário.</p>
      </div>
    );
  }

  const duration = slot ? (slot.end - slot.start) / 60000 : 30;

  return (
    <div className="bg-[var(--bg-elevated)] p-6 rounded-lg border border-[var(--border-primary)]">
      <BookingHeader slot={slot} date={date} />
      <div className="mb-4">
        <BookingValidator 
          dateTime={slot.start} 
          duration={duration} 
          onValidation={setIsValid} 
        />
      </div>
      <ValidationGuard isValid={isValid}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BookingFormFields form={form} onChange={setForm} />
          <Button 
            type="submit" 
            disabled={loading || !isValid} 
            className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            {loading ? 'Enviando...' : 'Solicitar Agendamento'}
          </Button>
        </form>
      </ValidationGuard>
    </div>
  );
}