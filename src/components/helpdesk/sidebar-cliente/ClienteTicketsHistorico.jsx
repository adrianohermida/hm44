import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import TicketHistoryItem from './TicketHistoryItem';

export default function ClienteTicketsHistorico({ ticketsHistorico = [], currentTicketId, onSelectTicket }) {
  const handleTicketClick = (ticket) => {
    if (ticket.id === currentTicketId) return;
    toast.info('Abrindo ticket...');
    onSelectTicket?.(ticket);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Histórico de Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {ticketsHistorico.slice(0, 5).map(t => (
          <TicketHistoryItem
            key={t.id}
            ticket={t}
            isCurrentTicket={t.id === currentTicketId}
            onClick={() => handleTicketClick(t)}
          />
        ))}
        {ticketsHistorico.length === 0 && (
          <p className="text-xs text-[var(--text-tertiary)] text-center py-2">
            Nenhum ticket anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}