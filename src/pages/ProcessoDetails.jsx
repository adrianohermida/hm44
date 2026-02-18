import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import Breadcrumb from '@/components/seo/Breadcrumb';
import LoadingState from '@/components/common/LoadingState';
import ProcessoAppBarSkeleton from '@/components/processos/detail/skeletons/ProcessoAppBarSkeleton';
import ProcessoTabsSkeleton from '@/components/processos/detail/skeletons/ProcessoTabsSkeleton';
import ProcessoSidebarSkeleton from '@/components/processos/detail/skeletons/ProcessoSidebarSkeleton';
import useProcessoActions from '@/components/processos/hooks/useProcessoActions';
import useProcessoData from '@/components/processos/detail/hooks/useProcessoData';
import useProcessoHandlers from '@/components/processos/detail/hooks/useProcessoHandlers';
import ProcessoErrorBoundary from '@/components/processos/detail/ProcessoErrorBoundary';
import ProcessoAppBar from '@/components/processos/detail/ProcessoAppBar';
import ProcessoLayout from '@/components/processos/detail/ProcessoLayout';
import ProcessoModalsContainer from '@/components/processos/detail/ProcessoModalsContainer';
import useHotkeys from '@/components/hooks/useHotkeys';
import useProcessoModals from '@/components/processos/detail/hooks/useProcessoModals';
import HotkeysGuide from '@/components/common/HotkeysGuide';
import ProcessoTicketModal from '@/components/processos/detail/ProcessoTicketModal';
import ProcessoAnalyticsPanel from '@/components/processos/detail/ProcessoAnalyticsPanel';

export default function ProcessoDetails() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const processoId = params.get('id');
  const fromClient = params.get('fromClient');
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const [modo, setModo] = React.useState('admin');
  const [viewingDoc, setViewingDoc] = React.useState(null);
  const [showHotkeysGuide, setShowHotkeysGuide] = React.useState(false);
  const [monitorado, setMonitorado] = React.useState(false);
  const [ticketOpen, setTicketOpen] = React.useState(false);
  const [analyticsOpen, setAnalyticsOpen] = React.useState(false);
  
  const modals = useProcessoModals();
  const actions = useProcessoActions();
  const { processo, clientes, partes, resumoIA, isLoading } = useProcessoData(processoId);
  const handlers = useProcessoHandlers(processoId, fromClient, actions, modals);

  useHotkeys({
    edit: () => modals.editModal.show(),
    new: () => modals.uploadModal.show(),
    close: handlers.handleBack,
    help: () => setShowHotkeysGuide(true),
    refresh: handlers.handleRefresh,
    exportPDF: handlers.handleExport,
    toggleMonitor: () => setMonitorado(!monitorado)
  });

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const appBarActions = {
    onBack: handlers.handleBack,
    onEdit: modals.editModal.show,
    onRefresh: handlers.handleRefresh,
    onExport: handlers.handleExport,
    onApensar: modals.apensarModal.show,
    monitored: monitorado,
    onToggleMonitor: () => setMonitorado(!monitorado),
    onOpenAnalytics: () => setAnalyticsOpen(true),
    onCriarTicket: () => navigate(createPageUrl('Helpdesk') + `?new=true&processo_id=${processoId}`)
  };

  const layoutHandlers = {
    ...handlers,
    onViewDocumento: (doc) => setViewingDoc(doc),
    onOpenTicket: () => setTicketOpen(true),
    onOpenChat: async (cliente) => {
      const event = new CustomEvent('openChatWithClient', { 
        detail: { clienteEmail: cliente.email, clienteNome: cliente.nome_completo } 
      });
      window.dispatchEvent(event);
    },
    onAddPublicacao: async (data) => {
      try {
        await base44.entities.PublicacaoProcesso.create({
          ...data, 
          escritorio_id: processo.escritorio_id, 
          processo_id: processoId
        });
        queryClient.invalidateQueries(['publicacoes']);
        toast.success('Publicação registrada');
      } catch (error) {
        toast.error('Erro ao registrar publicação: ' + error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <ProcessoErrorBoundary>
        <div className="min-h-screen bg-[var(--bg-secondary)]">
          <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
              <div className="h-6" />
            </div>
          </div>
          <ProcessoAppBarSkeleton />
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
            <ProcessoTabsSkeleton />
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6 mt-4">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <div className="h-64 bg-white rounded-lg animate-pulse" />
                  <div className="h-96 bg-white rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-1">
                <ProcessoSidebarSkeleton />
              </div>
            </div>
          </div>
        </div>
      </ProcessoErrorBoundary>
    );
  }
  
  if (!processo) return <div className="p-6">Processo não encontrado</div>;

  return (
    <ProcessoErrorBoundary>
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={[
            { label: fromClient ? 'Clientes' : 'Processos', url: fromClient ? `${createPageUrl('ClienteDetalhes')}?id=${fromClient}` : createPageUrl('Processos') },
            { label: processo.numero_cnj }
          ]} />
        </div>
      </div>

      <ProcessoAppBar 
        processo={processo}
        modo={modo}
        onModoChange={setModo}
        actions={appBarActions}
      />

      <ProcessoLayout
        processo={processo}
        clientes={clientes}
        partes={partes}
        resumoIA={resumoIA}
        isLoading={isLoading}
        modo={modo}
        isMobile={isMobile}
        handlers={layoutHandlers}
        modals={modals}
        actions={actions}
      />

      <ProcessoModalsContainer
        processo={processo}
        modals={modals}
        actions={actions}
        viewingDoc={viewingDoc}
        onCloseDoc={() => setViewingDoc(null)}
        onApensar={handlers.handleApensar}
      />

      <HotkeysGuide open={showHotkeysGuide} onClose={() => setShowHotkeysGuide(false)} />
      <ProcessoTicketModal 
        processo={processo}
        cliente={clientes[0] || null}
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
      />
      <ProcessoAnalyticsPanel 
        processo={processo}
        open={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      />
    </div>
    </ProcessoErrorBoundary>
  );
}