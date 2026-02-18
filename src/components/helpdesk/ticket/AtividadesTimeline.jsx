import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, Mail, CheckCircle, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AtividadesTimeline({ ticketId }) {
  const { data: mensagens = [] } = useQuery({
    queryKey: ['ticket-mensagens-atividades', ticketId],
    queryFn: () => base44.entities.TicketMensagem.filter({ ticket_id: ticketId }),
    enabled: !!ticketId
  });

  const { data: threads = [] } = useQuery({
    queryKey: ['ticket-threads-atividades', ticketId],
    queryFn: () => base44.entities.TicketThread.filter({ ticket_id: ticketId }),
    enabled: !!ticketId
  });

  const { data: ticket } = useQuery({
    queryKey: ['ticket-atividades', ticketId],
    queryFn: async () => {
      const [t] = await base44.entities.Ticket.filter({ id: ticketId });
      return t;
    },
    enabled: !!ticketId
  });

  const atividades = [
    ...mensagens.map(m => ({
      id: m.id,
      tipo: m.is_internal_note ? 'nota' : 'mensagem',
      data: m.created_date,
      autor: m.remetente_nome,
      descricao: m.is_internal_note ? 'adicionou uma nota interna' : 'enviou uma mensagem'
    })),
    ...threads.map(t => ({
      id: t.id,
      tipo: 'thread',
      data: t.created_date,
      autor: t.autor_nome,
      descricao: 'iniciou uma discussão'
    })),
    {
      id: 'criacao',
      tipo: 'criacao',
      data: ticket?.created_date,
      autor: ticket?.created_by || 'Sistema',
      descricao: 'criou o ticket'
    }
  ].sort((a, b) => new Date(b.data) - new Date(a.data));

  const getIcon = (tipo) => {
    switch(tipo) {
      case 'mensagem': return Mail;
      case 'nota': return Edit;
      case 'thread': return User;
      case 'criacao': return CheckCircle;
      default: return Clock;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="space-y-4">
          {atividades.map((atividade, index) => {
            const Icon = getIcon(atividade.tipo);
            return (
              <div key={atividade.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  {index < atividades.length - 1 && (
                    <div className="w-px h-full bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{atividade.autor}</span>{' '}
                    {atividade.descricao}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(atividade.data), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}