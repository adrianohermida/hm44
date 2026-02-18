import React from 'react';
import { Card } from '@/components/ui/card';
import TicketCard from './TicketCard';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function TicketsList({ tickets, selectedTicket, onSelect, loading }) {
  if (loading) return <ResumeLoader />;

  return (
    <Card className="lg:col-span-1 p-4 max-h-[600px] overflow-y-auto bg-[var(--bg-primary)]">
      <h2 className="font-semibold text-[var(--text-primary)] mb-4">Seus Tickets</h2>
      <div className="space-y-2">
        {tickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            isSelected={selectedTicket?.id === ticket.id}
            onClick={() => onSelect(ticket)}
          />
        ))}
        {tickets.length === 0 && (
          <p className="text-[var(--text-secondary)] text-center py-8">Nenhum ticket</p>
        )}
      </div>
    </Card>
  );
}