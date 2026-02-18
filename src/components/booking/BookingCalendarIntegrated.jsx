import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Calendar, Clock, Check } from 'lucide-react';

/**
 * Componente de agendamento integrado com Google Calendar do Dr. Adriano
 * - Sincroniza slots disponíveis
 * - Cliente seleciona data/hora
 * - Cria agendamento em status pendente_confirmacao
 * - Admin aprova via Dashboard
 */
export default function BookingCalendarIntegrated({ clienteNome, clienteEmail, clienteTelefone }) {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState('date'); // 'date' | 'time' | 'confirm' | 'done'
  
  // STEP 1: Sincronizar Google Calendar para obter slots disponíveis
  const { data: availableSlots = [] } = useQuery({
    queryKey: ['available-slots-dr-adriano'],
    queryFn: async () => {
      const response = await base44.functions.invoke('syncGoogleCalendarDoctor', {});
      if (!response.data.success) {
        throw new Error('Erro ao sincronizar calendário');
      }
      
      // Buscar slots disponíveis do cache
      const availabilities = await base44.entities.CalendarAvailability.filter({
        doctor_email: 'adriano@example.com'
      });
      
      if (availabilities.length === 0) return [];
      
      const slots = JSON.parse(availabilities[0].slots_json || '[]');
      return slots.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    },
    refetchInterval: 5 * 60 * 1000, // Sincronizar a cada 5 min
  });

  // STEP 2: Agrupar slots por data
  const datesByMonth = React.useMemo(() => {
    const dates = new Set(availableSlots.map(s => s.date));
    return Array.from(dates).sort();
  }, [availableSlots]);

  // STEP 3: Buscar times para data selecionada
  const timesForDate = React.useMemo(() => {
    if (!selectedDate) return [];
    return availableSlots
      .filter(s => s.date === selectedDate && s.available)
      .map(s => s.time);
  }, [selectedDate, availableSlots]);

  // STEP 4: Mutation para criar agendamento
  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('createAppointmentBilateral', {
        cliente_nome: clienteNome,
        cliente_email: clienteEmail,
        cliente_telefone: clienteTelefone,
        data: selectedDate,
        hora: selectedTime,
        tipo_agendamento: 'consultoria',
        descricao: 'Agendamento via MeuPainel'
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['available-slots-dr-adriano']);
      setStep('done');
      toast.success('Agendamento solicitado! Aguarde confirmação do Dr. Adriano.');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao agendar');
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Agendar com Dr. Adriano
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* STEP: Select Date */}
        {step === 'date' && (
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">Selecione uma data</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {datesByMonth.map(date => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setStep('time');
                  }}
                  className={`p-2 rounded border transition-colors ${
                    selectedDate === date
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                      : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]'
                  }`}
                >
                  <div className="text-xs font-semibold">
                    {new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                  <div className="text-xs">
                    {new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: Select Time */}
        {step === 'time' && selectedDate && (
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              Horários disponíveis para {new Date(selectedDate).toLocaleDateString('pt-BR')}
            </p>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
              {timesForDate.map(time => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time);
                    setStep('confirm');
                  }}
                  className={`p-2 rounded border transition-colors ${
                    selectedTime === time
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                      : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]'
                  }`}
                >
                  <Clock className="w-3 h-3 mx-auto mb-1" />
                  <div className="text-xs font-semibold">{time}</div>
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setStep('date')}
              className="w-full"
            >
              Voltar
            </Button>
          </div>
        )}

        {/* STEP: Confirm */}
        {step === 'confirm' && selectedDate && selectedTime && (
          <div className="space-y-4">
            <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm">
                <strong>Hora:</strong> {selectedTime}
              </p>
              <p className="text-sm">
                <strong>Tipo:</strong> Consultoria
              </p>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Sua solicitação será enviada para aprovação do Dr. Adriano. Você receberá uma confirmação por email.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('time')}
              >
                Voltar
              </Button>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
                className="bg-[var(--brand-primary)]"
              >
                {createMutation.isPending ? 'Agendando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        )}

        {/* STEP: Done */}
        {step === 'done' && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 bg-[var(--brand-primary)] rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">
              Agendamento Solicitado!
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Você receberá um email de confirmação em breve.
            </p>
            <Button
              onClick={() => {
                setStep('date');
                setSelectedDate(null);
                setSelectedTime(null);
              }}
              variant="outline"
              className="w-full"
            >
              Fazer outro agendamento
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}