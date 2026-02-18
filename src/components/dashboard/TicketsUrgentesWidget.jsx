import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TicketUrgenteItem from './tickets/TicketUrgenteItem';
import TicketUrgenteEmpty from './tickets/TicketUrgenteEmpty';

export default function TicketsUrgentesWidget() {
  const navigate = useNavigate();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets-urgentes'],
    queryFn: async () => {
      const duasHorasAtras = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const allTickets = await base44.entities.Ticket.filter({
        escritorio_id: escritorio.id,
        status: { $in: ['aberto', 'em_atendimento'] }
      }, '-created_date', 5);

      return allTickets.filter(t => 
        !t.tempo_primeira_resposta &&
        new Date(t.created_date) < duasHorasAtras
      );
    },
    enabled: !!escritorio?.id
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tickets Urgentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--brand-primary)]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Tickets Urgentes</CardTitle>
        {tickets.length > 0 ? (
          <Badge variant="destructive">{tickets.length}</Badge>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => navigate(createPageUrl('Helpdesk'))}>
            <MessageSquare className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {tickets.length === 0 ? (
          <TicketUrgenteEmpty />
        ) : (
          <>
            {tickets.map(ticket => (
              <TicketUrgenteItem
                key={ticket.id}
                ticket={ticket}
                onClick={() => navigate(`${createPageUrl('Helpdesk')}?ticket=${ticket.id}`)}
              />
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate(createPageUrl('Helpdesk'))}
            >
              Ver Todos
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}