import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HelpdeskTicketCard from './HelpdeskTicketCard';
import InboxEmpty from './InboxEmpty';
import TicketPagination from './TicketPagination';
import TicketLayoutSelector from './TicketLayoutSelector';
import TicketInboxView from './views/TicketInboxView';
import TicketTableView from './views/TicketTableView';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useTicketListLogic } from '../hooks/useTicketListLogic';

export default function HelpdeskTicketList({ 
  filtros, 
  escritorioId, 
  ticketSelecionado, 
  onSelectTicket,
  selectedIds = [],
  onSelectedIdsChange
}) {
  const queryClient = useQueryClient();
  
  const {
    tickets,
    paginatedTickets,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    layoutMode,
    setLayoutMode
  } = useTicketListLogic(filtros, escritorioId);

  // Debug filtros
  React.useEffect(() => {
    console.log('🔍 Filtros aplicados:', filtros);
    console.log('📊 Total tickets:', tickets.length);
  }, [filtros, tickets.length]);

  const handleCheck = (ticketId, checked) => {
    const newIds = checked 
      ? [...selectedIds, ticketId] 
      : selectedIds.filter(id => id !== ticketId);
    onSelectedIdsChange?.(newIds);
  };

  const handleSelectAll = (checked) => {
    const newIds = checked ? tickets.map(t => t.id) : [];
    onSelectedIdsChange?.(newIds);
  };

  const handleClearSelection = () => {
    onSelectedIdsChange?.([]);
  };

  const resolverMutation = useMutation({
    mutationFn: async (ticketId) => {
      await base44.entities.Ticket.update(ticketId, {
        status: 'resolvido',
        tempo_resolucao: new Date().toISOString(),
        ultima_atualizacao: new Date().toISOString()
      });
      
      const [ticket] = await base44.entities.Ticket.filter({ id: ticketId });
      if (ticket?.cliente_email) {
        try {
          await base44.functions.invoke('sendEmailSendGrid', {
            to: ticket.cliente_email,
            subject: `Ticket resolvido: ${ticket.titulo}`,
            body: `Olá ${ticket.cliente_nome},\n\nSeu ticket foi marcado como resolvido.\n\nSe precisar de mais ajuda, basta responder este email.\n\nAtenciosamente,\nEquipe de Suporte`,
            ticket_id: ticket.id
          });
        } catch (emailError) {
          console.error('Erro ao enviar email de resolução:', emailError);
          toast.warning('Ticket resolvido, mas email não enviado');
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Ticket resolvido');
    },
    onError: () => toast.error('Erro ao resolver ticket')
  });

  const arquivarMutation = useMutation({
    mutationFn: (ticketId) => base44.entities.Ticket.update(ticketId, {
      status: 'fechado',
      ultima_atualizacao: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Ticket arquivado');
    },
    onError: () => toast.error('Erro ao arquivar ticket')
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner text="Carregando tickets..." />
      </div>
    );
  }

  if (tickets.length === 0) {
    return <InboxEmpty onResetFiltros={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.length === tickets.length && tickets.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-xs text-[var(--text-tertiary)]">
            {selectedIds.length > 0 ? `${selectedIds.length} selecionados` : `${tickets.length} tickets`}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {paginatedTickets.map(ticket => (
          <HelpdeskTicketCard
            key={ticket.id}
            ticket={ticket}
            isSelected={ticketSelecionado?.id === ticket.id}
            onSelect={() => onSelectTicket(ticket)}
            isChecked={selectedIds.includes(ticket.id)}
            onCheck={(checked) => handleCheck(ticket.id, checked)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <TicketPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}