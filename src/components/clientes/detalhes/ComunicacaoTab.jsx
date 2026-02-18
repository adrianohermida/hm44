import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Mail, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ConversaItem({ conversa }) {
  return (
    <div className="p-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="text-sm font-medium">{conversa.canal}</span>
          {conversa.tipo === 'visitante' && (
            <Badge variant="outline" className="text-xs">Visitante</Badge>
          )}
        </div>
        <span className="text-xs text-[var(--text-secondary)]">
          {format(new Date(conversa.created_date), 'dd/MM/yyyy', { locale: ptBR })}
        </span>
      </div>
      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
        {conversa.ultima_mensagem || 'Sem mensagens'}
      </p>
    </div>
  );
}

function TicketItem({ ticket }) {
  return (
    <div className="p-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="text-sm font-medium">{ticket.titulo}</span>
          {ticket.origem_conversa_id && (
            <Badge variant="secondary" className="text-xs">Chat ↑</Badge>
          )}
        </div>
        <Badge variant={ticket.status === 'fechado' ? 'outline' : 'default'}>
          {ticket.status}
        </Badge>
      </div>
      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
        {ticket.descricao}
      </p>
    </div>
  );
}

export default function ComunicacaoTab({ clienteEmail, escritorioId }) {
  const { data: conversas = [], isLoading: conversasLoading } = useQuery({
    queryKey: ['conversas-cliente', clienteEmail],
    queryFn: () => base44.entities.Conversa.filter({ 
      cliente_email: clienteEmail 
    }, '-created_date', 50),
    enabled: !!clienteEmail,
    staleTime: 2 * 60 * 1000
  });

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['tickets-cliente', clienteEmail],
    queryFn: () => base44.entities.Ticket.filter({ 
      cliente_email: clienteEmail 
    }, '-created_date', 50),
    enabled: !!clienteEmail,
    staleTime: 2 * 60 * 1000
  });

  const timeline = [
    ...conversas.map(c => ({ ...c, type: 'conversa', date: c.created_date })),
    ...tickets.map(t => ({ ...t, type: 'ticket', date: t.created_date }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Tabs defaultValue="timeline" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="timeline" className="gap-2">
          <Clock className="w-4 h-4" />
          Linha do Tempo
        </TabsTrigger>
        <TabsTrigger value="conversas" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          Conversas ({conversas.length})
        </TabsTrigger>
        <TabsTrigger value="tickets" className="gap-2">
          <Mail className="w-4 h-4" />
          Tickets ({tickets.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="timeline" className="space-y-3 mt-4">
        {conversasLoading || ticketsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : timeline.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)] py-8">
            Nenhuma interação registrada
          </p>
        ) : (
          timeline.map((item, i) => (
            <div key={i}>
              {item.type === 'conversa' ? (
                <ConversaItem conversa={item} />
              ) : (
                <TicketItem ticket={item} />
              )}
            </div>
          ))
        )}
      </TabsContent>

      <TabsContent value="conversas" className="space-y-3 mt-4">
        {conversasLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : conversas.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)] py-8">
            Nenhuma conversa registrada
          </p>
        ) : (
          conversas.map(c => <ConversaItem key={c.id} conversa={c} />)
        )}
      </TabsContent>

      <TabsContent value="tickets" className="space-y-3 mt-4">
        {ticketsLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)] py-8">
            Nenhum ticket registrado
          </p>
        ) : (
          tickets.map(t => <TicketItem key={t.id} ticket={t} />)
        )}
      </TabsContent>
    </Tabs>
  );
}