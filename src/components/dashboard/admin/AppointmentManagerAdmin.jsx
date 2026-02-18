import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, X, RefreshCw, Clock, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Dashboard Admin - Gerenciar agendamentos bilaterais
 * - Listar solicitações pendentes
 * - Confirmar (cria evento Google Calendar)
 * - Remarcar (novo slot)
 * - Rejeitar (notifica cliente)
 */
export default function AppointmentManagerAdmin({ escritorioId }) {
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newData, setNewData] = useState({ date: '', time: '' });

  // STEP 1: Buscar agendamentos pendentes
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments-admin', escritorioId],
    queryFn: () =>
      base44.entities.Appointment.filter(
        { 
          escritorio_id: escritorioId,
          status: 'pendente_confirmacao'
        },
        '-created_date',
        50
      ),
    enabled: !!escritorioId,
  });

  // STEP 2: Mutations para ações
  const confirmMutation = useMutation({
    mutationFn: (appointmentId) =>
      base44.functions.invoke('confirmAppointmentAdmin', {
        appointment_id: appointmentId,
        action: 'confirmar'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments-admin']);
      setSelectedAppointment(null);
      toast.success('Agendamento confirmado!');
    },
    onError: (error) => toast.error(error.message)
  });

  const rejectMutation = useMutation({
    mutationFn: (appointmentId) =>
      base44.functions.invoke('confirmAppointmentAdmin', {
        appointment_id: appointmentId,
        action: 'rejeitar'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments-admin']);
      setSelectedAppointment(null);
      toast.success('Agendamento rejeitado');
    },
    onError: (error) => toast.error(error.message)
  });

  const rescheduleMutation = useMutation({
    mutationFn: (appointmentId) =>
      base44.functions.invoke('confirmAppointmentAdmin', {
        appointment_id: appointmentId,
        action: 'remarcar',
        new_data: newData
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments-admin']);
      setSelectedAppointment(null);
      setNewData({ date: '', time: '' });
      toast.success('Agendamento remarcado');
    },
    onError: (error) => toast.error(error.message)
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos Pendentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Agendamentos Pendentes ({appointments.length})</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => queryClient.refetchQueries(['appointments-admin'])}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)] py-8">
            Nenhum agendamento pendente
          </p>
        ) : (
          appointments.map(apt => (
            <div
              key={apt.id}
              className={`border border-[var(--border-primary)] rounded-lg p-3 transition-colors ${
                selectedAppointment?.id === apt.id ? 'bg-[var(--bg-tertiary)]' : ''
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--text-primary)]">
                    {apt.cliente_nome}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {apt.cliente_email}
                  </p>
                </div>
                <Badge variant="outline" className="ml-2">
                  <Clock className="w-3 h-3 mr-1" />
                  {apt.status}
                </Badge>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <p className="text-[var(--text-tertiary)]">Data</p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {new Date(apt.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--text-tertiary)]">Hora</p>
                  <p className="font-semibold text-[var(--text-primary)]">{apt.hora}</p>
                </div>
              </div>

              {/* Actions - Collapsed */}
              {selectedAppointment?.id !== apt.id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedAppointment(apt)}
                  className="w-full"
                >
                  Ver detalhes
                </Button>
              )}

              {/* Actions - Expanded */}
              {selectedAppointment?.id === apt.id && (
                <div className="space-y-3 border-t border-[var(--border-primary)] pt-3">
                  {/* Reschedule Form */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[var(--text-primary)]">
                      Remarcar (opcional)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={newData.date}
                        onChange={(e) => setNewData({ ...newData, date: e.target.value })}
                        className="px-2 py-1 text-xs border border-[var(--border-primary)] rounded"
                      />
                      <input
                        type="time"
                        value={newData.time}
                        onChange={(e) => setNewData({ ...newData, time: e.target.value })}
                        className="px-2 py-1 text-xs border border-[var(--border-primary)] rounded"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAppointment(null)}
                      disabled={confirmMutation.isPending || rejectMutation.isPending}
                    >
                      Fechar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => rejectMutation.mutate(apt.id)}
                      disabled={confirmMutation.isPending || rejectMutation.isPending}
                      variant="destructive"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        newData.date && newData.time
                          ? rescheduleMutation.mutate(apt.id)
                          : confirmMutation.mutate(apt.id)
                      }
                      disabled={
                        confirmMutation.isPending ||
                        rescheduleMutation.isPending ||
                        rejectMutation.isPending
                      }
                      className="bg-[var(--brand-primary)]"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {newData.date ? 'Remarcar' : 'Confirmar'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}