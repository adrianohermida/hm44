import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  UserPlus, 
  Edit,
  StickyNote,
  Forward,
  Archive,
  AlertCircle
} from 'lucide-react';

const eventoConfig = {
  criado: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
  resposta_enviada: { icon: Mail, color: 'text-green-600', bg: 'bg-green-50' },
  resposta_recebida: { icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
  status_alterado: { icon: Edit, color: 'text-purple-600', bg: 'bg-purple-50' },
  atribuido: { icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  nota_interna: { icon: StickyNote, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  encaminhado: { icon: Forward, color: 'text-orange-600', bg: 'bg-orange-50' },
  resolvido: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  fechado: { icon: Archive, color: 'text-gray-600', bg: 'bg-gray-50' },
  prioridade_alterada: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

export default function TicketTimelineDetalhada({ ticketId }) {
  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['ticket-timeline', ticketId],
    queryFn: async () => {
      const ticket = await base44.entities.Ticket.filter({ id: ticketId });
      const mensagens = await base44.entities.TicketMensagem.filter({ ticket_id: ticketId });
      
      const timeline = [];

      // Evento de criação
      if (ticket[0]) {
        timeline.push({
          tipo: 'criado',
          timestamp: ticket[0].created_date,
          autor: ticket[0].created_by,
          detalhes: `Ticket criado por ${ticket[0].created_by}`
        });
      }

      // Mensagens
      mensagens.forEach(m => {
        if (m.is_internal_note) {
          timeline.push({
            tipo: 'nota_interna',
            timestamp: m.created_date,
            autor: m.remetente_email,
            detalhes: `Nota adicionada por ${m.remetente_nome}`
          });
        } else if (m.tipo_remetente === 'cliente') {
          timeline.push({
            tipo: 'resposta_recebida',
            timestamp: m.created_date,
            autor: m.remetente_email,
            detalhes: `Resposta recebida de ${m.remetente_nome}`
          });
        } else {
          timeline.push({
            tipo: 'resposta_enviada',
            timestamp: m.created_date,
            autor: m.remetente_email,
            detalhes: `Resposta enviada por ${m.remetente_nome}`
          });
        }
      });

      // Eventos de status
      if (ticket[0]?.tempo_primeira_resposta) {
        timeline.push({
          tipo: 'status_alterado',
          timestamp: ticket[0].tempo_primeira_resposta,
          detalhes: 'Status alterado para: Em Atendimento'
        });
      }

      if (ticket[0]?.tempo_resolucao) {
        timeline.push({
          tipo: 'resolvido',
          timestamp: ticket[0].tempo_resolucao,
          detalhes: 'Ticket marcado como Resolvido'
        });
      }

      return timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    enabled: !!ticketId
  });

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">Carregando timeline...</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-4">Timeline Completa</h3>
        <div className="space-y-3">
          {eventos.map((evento, idx) => {
            const config = eventoConfig[evento.tipo] || eventoConfig.criado;
            const Icon = config.icon;

            return (
              <div key={idx} className="flex gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${config.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{evento.detalhes}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(evento.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                  {evento.autor && (
                    <div className="text-xs text-gray-500">Por: {evento.autor}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}