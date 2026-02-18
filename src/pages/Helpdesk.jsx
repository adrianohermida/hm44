import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import HelpdeskSidebar from '@/components/helpdesk/inbox/HelpdeskSidebar';
import HelpdeskTicketList from '@/components/helpdesk/inbox/HelpdeskTicketList';
import HelpdeskTicketListSlim from '@/components/helpdesk/inbox/HelpdeskTicketListSlim';
import HelpdeskFiltrosDropdown from '@/components/helpdesk/inbox/HelpdeskFiltrosDropdown';
const HelpdeskTicketPanel = React.lazy(() => 
  import('@/components/helpdesk/ticket/HelpdeskTicketPanel')
);
const TicketSidebarAccordion = React.lazy(() =>
  import('@/components/helpdesk/ticket/TicketSidebarAccordion')
);
const MesclarTicketsModal = React.lazy(() =>
  import('@/components/helpdesk/modals/MesclarTicketsModal')
);
const EncaminharTicketModal = React.lazy(() =>
  import('@/components/helpdesk/modals/EncaminharTicketModal')
);
const AtualizacaoMassaModal = React.lazy(() =>
  import('@/components/helpdesk/modals/AtualizacaoMassaModal')
);
const NovoTicketModal = React.lazy(() =>
  import('@/components/helpdesk/NovoTicketModal')
);
import HelpdeskHeaderSimple from '@/components/helpdesk/HelpdeskHeaderSimple';
import FiltrosCompactos from '@/components/helpdesk/inbox/FiltrosCompactos';

import HelpdeskErrorBoundary from '@/components/helpdesk/HelpdeskErrorBoundary';
import HelpdeskErrorFallback from '@/components/helpdesk/errors/HelpdeskErrorFallback';
import { TicketListSkeleton } from '@/components/helpdesk/skeleton/HelpdeskSkeleton';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { useHelpdeskMetrics } from '@/components/helpdesk/performance/HelpdeskMetricsTracker';
import { useHelpdeskMutations } from '@/components/helpdesk/hooks/useHelpdeskMutations';
import { useHelpdeskData } from '@/components/helpdesk/hooks/useHelpdeskData';
import { useHelpdeskRealtimeSync } from '@/components/helpdesk/notifications/useHelpdeskRealtimeSync';

export default function Helpdesk() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const showNovoTicket = params.get('new') === 'true';
  const processoIdParam = params.get('processo_id');
  const ticketIdParam = params.get('ticket');
  
  const [filtros, setFiltros] = useState({
    status: 'aberto,triagem',
    prioridade: 'todos',
    departamento: 'todos',
    responsavel: 'todos'
  });
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState(null);
  const [novoTicketOpen, setNovoTicketOpen] = useState(showNovoTicket);
  const [processoVinculado, setProcessoVinculado] = useState(null);

  const { user, escritorio, tickets, isLoading } = useHelpdeskData();
  
  // Real-time sync para helpdesk
  useHelpdeskRealtimeSync(escritorio?.id, !!escritorio);
  
  const {
    resolverMutation,
    excluirMutation,
    mesclarMutation,
    encaminharMutation,
    atualizarMassaMutation
  } = useHelpdeskMutations(selectedIds, setSelectedIds, escritorio?.id);

  useHelpdeskMetrics(ticketSelecionado?.id, 'view_ticket');

  useEffect(() => {
    if (processoIdParam && escritorio?.id) {
      base44.entities.Processo.filter({ 
        id: processoIdParam,
        escritorio_id: escritorio.id 
      }).then(result => {
        if (result && result.length > 0) {
          setProcessoVinculado(result[0]);
        }
      }).catch(() => {
        toast.error('Erro ao carregar processo');
      });
    }
  }, [processoIdParam, escritorio?.id]);

  useEffect(() => {
    if (ticketIdParam && tickets.length > 0) {
      const ticket = tickets.find(t => t.id === ticketIdParam);
      if (ticket) {
        setTicketSelecionado(ticket);
      }
    }
  }, [ticketIdParam, tickets]);

  const ticketsSelecionados = tickets.filter(t => selectedIds.includes(t.id));

  const ticketsStats = React.useMemo(() => {
    if (!tickets) return {};
    return {
      abertos: tickets.filter(t => ['aberto', 'triagem'].includes(t.status)).length,
      em_atendimento: tickets.filter(t => t.status === 'em_atendimento').length,
      aguardando: tickets.filter(t => t.status === 'aguardando_cliente').length,
      resolvidos: tickets.filter(t => t.status === 'resolvido').length
    };
  }, [tickets]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <div className="border-b border-[var(--border-primary)] bg-[var(--bg-elevated)] p-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto p-4">
          <TicketListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <HelpdeskErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-secondary)] pb-20 md:pb-0">
        {/* Header Minimalista */}
        <div className="border-b border-[var(--border-primary)] bg-[var(--bg-elevated)]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <HelpdeskHeaderSimple 
              escritorioId={escritorio?.id}
              onNovoTicket={() => setNovoTicketOpen(true)}
            />
          </div>
        </div>

        {/* Filtros Compactos */}
        <div className="border-b border-[var(--border-primary)] bg-[var(--bg-elevated)]">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <FiltrosCompactos 
              filtros={filtros}
              onFiltrosChange={setFiltros}
              stats={ticketsStats}
            />
          </div>
        </div>

        {/* Content Mobile First */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid md:grid-cols-[1fr_auto] lg:grid-cols-2 gap-4">
            {/* Lista */}
            <div className={cn(
              ticketSelecionado && "hidden md:block"
            )}>
              <HelpdeskTicketList
                filtros={filtros}
                escritorioId={escritorio?.id}
                ticketSelecionado={ticketSelecionado}
                onSelectTicket={setTicketSelecionado}
                selectedIds={selectedIds}
                onSelectedIdsChange={setSelectedIds}
              />
            </div>

            {/* Detalhes */}
            {ticketSelecionado && (
              <div className={cn(
                "md:min-w-[500px] lg:min-w-0"
              )}>
                <React.Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
                  </div>
                }>
                  <HelpdeskTicketPanel
                    ticket={ticketSelecionado}
                    onClose={() => setTicketSelecionado(null)}
                  />
                </React.Suspense>
              </div>
            )}
          </div>
        </div>
      </div>

              <React.Suspense fallback={null}>
                <MesclarTicketsModal
                  open={bulkAction === 'mesclar'}
                  onClose={() => setBulkAction(null)}
                  selectedTickets={ticketsSelecionados}
                  onConfirm={(data) => mesclarMutation.mutate(data)}
                  isLoading={mesclarMutation.isPending}
                />

                <EncaminharTicketModal
                  open={bulkAction === 'encaminhar'}
                  onClose={() => setBulkAction(null)}
                  ticket={ticketsSelecionados[0]}
                  onConfirm={(data) => encaminharMutation.mutate(data)}
                  isLoading={encaminharMutation.isPending}
                />

                <AtualizacaoMassaModal
                  open={bulkAction === 'atualizar_massa'}
                  onClose={() => setBulkAction(null)}
                  selectedCount={selectedIds.length}
                  escritorioId={escritorio?.id}
                  onConfirm={(data) => atualizarMassaMutation.mutate(data)}
                  isLoading={atualizarMassaMutation.isPending}
                />

                <NovoTicketModal
                  open={novoTicketOpen}
                  onClose={() => {
                    setNovoTicketOpen(false);
                    setProcessoVinculado(null);
                    window.history.replaceState({}, '', createPageUrl('Helpdesk'));
                  }}
                  escritorioId={escritorio?.id}
                  processoInicial={processoVinculado}
                />
              </React.Suspense>
              </HelpdeskErrorBoundary>
              );
              }