import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function HelpdeskInconsistencias() {
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['inconsistencias-tickets', escritorio?.id],
    queryFn: () => base44.entities.Ticket.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const { data: mensagens = [] } = useQuery({
    queryKey: ['inconsistencias-mensagens', escritorio?.id],
    queryFn: () => base44.entities.TicketMensagem.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const deleteMutation = useMutation({
    mutationFn: (ticketId) => base44.entities.Ticket.delete(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries(['inconsistencias-tickets']);
      toast.success('Ticket removido');
    }
  });

  const mesclarMutation = useMutation({
    mutationFn: ({ ticketId, targetId }) => 
      base44.functions.invoke('helpdesk/mesclarTickets', {
        ticket_ids: [ticketId, targetId],
        escritorio_id: escritorio.id
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['inconsistencias-tickets']);
      toast.success('Tickets mesclados');
    }
  });

  const reatribuirMutation = useMutation({
    mutationFn: ({ ticketId }) => 
      base44.functions.invoke('helpdesk/autoAssign', {
        ticket_id: ticketId,
        escritorio_id: escritorio.id
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['inconsistencias-tickets']);
      toast.success('Ticket reatribuído');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  // Detectar inconsistências
  const ticketsOrfaos = tickets.filter(t => {
    const hasMensagens = mensagens.some(m => m.ticket_id === t.id);
    return !hasMensagens;
  });

  const ticketsDuplicados = [];
  const seen = new Map();
  tickets.forEach(t => {
    const key = `${t.cliente_email}-${t.titulo}`;
    if (seen.has(key)) {
      ticketsDuplicados.push({ ticket: t, duplicadoDe: seen.get(key) });
    } else {
      seen.set(key, t);
    }
  });

  const slaExpirados = tickets.filter(t => {
    if (t.status === 'resolvido' || t.status === 'fechado') return false;
    const created = new Date(t.created_date);
    const now = new Date();
    const horasDecorridas = (now - created) / (1000 * 60 * 60);
    return horasDecorridas > 24;
  });

  const totalInconsistencias = ticketsOrfaos.length + ticketsDuplicados.length + slaExpirados.length;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[
        { label: 'Atendimento', url: createPageUrl('Helpdesk') },
        { label: 'Inconsistências' }
      ]} />

      <div>
        <h1 className="text-2xl font-bold">Detector de Inconsistências</h1>
        <p className="text-sm text-gray-600">Identifique e corrija problemas nos tickets</p>
      </div>

      {totalInconsistencias === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-green-900 mb-2">Tudo limpo!</h3>
            <p className="text-sm text-green-700 text-center max-w-md">
              Nenhuma inconsistência detectada. Seu sistema de tickets está funcionando perfeitamente.
            </p>
          </CardContent>
        </Card>
      )}

      {totalInconsistencias > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              Tickets Órfãos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{ticketsOrfaos.length}</p>
            <p className="text-xs text-gray-600 mb-4">Tickets sem mensagens</p>
            {ticketsOrfaos.slice(0, 3).map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 bg-orange-50 rounded mb-2">
                <span className="text-sm truncate flex-1">{t.titulo}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => deleteMutation.mutate(t.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Duplicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{ticketsDuplicados.length}</p>
            <p className="text-xs text-gray-600 mb-4">Mesmo cliente e título</p>
            {ticketsDuplicados.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded mb-2">
                <span className="text-sm truncate flex-1">{item.ticket.titulo}</span>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => mesclarMutation.mutate({ 
                      ticketId: item.ticket.id, 
                      targetId: item.duplicadoDe.id 
                    })}
                    title="Mesclar"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => deleteMutation.mutate(item.ticket.id)}
                    title="Excluir"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              SLA Expirados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{slaExpirados.length}</p>
            <p className="text-xs text-gray-600 mb-4">Abertos há mais de 24h</p>
            {slaExpirados.slice(0, 3).map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded mb-2">
                <span className="text-sm truncate flex-1">{t.titulo}</span>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => reatribuirMutation.mutate({ ticketId: t.id })}
                    title="Reatribuir automaticamente"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => window.open(createPageUrl('Helpdesk') + `?ticket=${t.id}`, '_blank')}
                    title="Abrir ticket"
                  >
                    <AlertTriangle className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}