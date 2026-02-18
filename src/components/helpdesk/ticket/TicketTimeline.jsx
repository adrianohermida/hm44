import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, Mail, MessageSquare, User, Tag, 
  AlertCircle, CheckCircle2, Eye, Ban 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EmailStatusBadge from '@/components/helpdesk/EmailStatusBadge';

const eventIcons = {
  criacao: Clock,
  mensagem: MessageSquare,
  email_enviado: Mail,
  email_aberto: Eye,
  status_mudado: Tag,
  atribuido: User,
  spam_marcado: Ban,
  resolvido: CheckCircle2,
  erro: AlertCircle
};

export default function TicketTimeline({ ticketId }) {
  const { data: mensagens = [] } = useQuery({
    queryKey: ['ticket-mensagens', ticketId],
    queryFn: () => base44.entities.TicketMensagem.filter({ ticket_id: ticketId }, '-created_date'),
    enabled: !!ticketId
  });

  const { data: emailStatus = [] } = useQuery({
    queryKey: ['email-status', ticketId],
    queryFn: () => base44.entities.EmailStatus.filter({ ticket_id: ticketId }, '-created_date'),
    enabled: !!ticketId
  });

  const { data: ticket } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const [t] = await base44.entities.Ticket.filter({ id: ticketId });
      return t;
    },
    enabled: !!ticketId
  });

  const events = React.useMemo(() => {
    const all = [];

    if (ticket) {
      all.push({
        type: 'criacao',
        timestamp: ticket.created_date,
        autor: ticket.cliente_nome,
        detalhes: `Ticket criado: ${ticket.titulo}`
      });

      if (ticket.responsavel_email) {
        all.push({
          type: 'atribuido',
          timestamp: ticket.created_date,
          autor: 'Sistema',
          detalhes: `Atribuído para ${ticket.responsavel_email}`
        });
      }
    }

    mensagens.forEach(msg => {
      all.push({
        type: 'mensagem',
        timestamp: msg.created_date,
        autor: msg.remetente_nome,
        detalhes: msg.conteudo.substring(0, 100) + (msg.conteudo.length > 100 ? '...' : ''),
        tipoRemetente: msg.tipo_remetente
      });
    });

    emailStatus.forEach(email => {
      if (email.timestamp_envio) {
        all.push({
          type: 'email_enviado',
          timestamp: email.timestamp_envio,
          autor: 'Sistema',
          detalhes: `Email enviado para ${email.destinatario_email}`,
          status: email.status,
          emailId: email.id
        });
      }

      if (email.timestamp_abertura) {
        all.push({
          type: 'email_aberto',
          timestamp: email.timestamp_abertura,
          autor: email.destinatario_email,
          detalhes: 'Email aberto pelo destinatário',
          emailId: email.id
        });
      }
    });

    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [ticket, mensagens, emailStatus]);

  if (!ticketId) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-4 py-4">
            {events.map((event, idx) => {
              const Icon = eventIcons[event.type] || Clock;
              const isCliente = event.tipoRemetente === 'cliente';
              
              return (
                <div key={idx} className="flex gap-3">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${isCliente ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    <Icon className={`w-4 h-4 ${isCliente ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {event.autor}
                      </p>
                      <span className="text-xs text-[var(--text-tertiary)] whitespace-nowrap">
                        {format(new Date(event.timestamp), "dd MMM HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-[var(--text-secondary)] mt-1 break-words">
                      {event.detalhes}
                    </p>

                    {event.status && (
                      <div className="mt-2">
                        <EmailStatusBadge status={event.status} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {events.length === 0 && (
              <p className="text-sm text-[var(--text-tertiary)] text-center py-8">
                Nenhum evento registrado
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}