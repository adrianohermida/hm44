import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AtividadesRecentes({ escritorioId, onSelectTicket }) {
  const { data: mensagens = [] } = useQuery({
    queryKey: ['atividades-recentes', escritorioId],
    queryFn: async () => {
      const msgs = await base44.entities.TicketMensagem.filter(
        { escritorio_id: escritorioId },
        '-created_date',
        10
      );
      
      if (msgs.length === 0) return [];
      
      const ticketIds = [...new Set(msgs.map(m => m.ticket_id))];
      const allTickets = await base44.entities.Ticket.filter({ 
        escritorio_id: escritorioId,
        id: { $in: ticketIds }
      });
      
      return msgs.map(msg => ({
        ...msg,
        ticket: allTickets.find(t => t.id === msg.ticket_id)
      })).filter(m => m.ticket);
    },
    enabled: !!escritorioId
  });

  if (mensagens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <MessageSquare className="w-8 h-8 text-[var(--text-tertiary)] mb-2" />
            <p className="text-sm text-[var(--text-secondary)]">
              Nenhuma atividade recente
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mensagens.slice(0, 8).map(atividade => (
          <button
            key={atividade.id}
            onClick={() => onSelectTicket(atividade.ticket)}
            className="w-full text-left p-2 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                {atividade.tipo_remetente === 'cliente' ? (
                  <User className="w-4 h-4 text-[var(--text-tertiary)]" />
                ) : (
                  <MessageSquare className="w-4 h-4 text-[var(--brand-primary)]" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {atividade.remetente_nome}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {atividade.tipo_remetente}
                  </Badge>
                </div>
                
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {atividade.conteudo}
                </p>
                
                <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-tertiary)]">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(atividade.created_date), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </div>
              </div>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}