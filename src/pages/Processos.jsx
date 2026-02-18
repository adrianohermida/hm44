import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

import ProcessosHeader from '@/components/processos/ProcessosHeader';
import ProcessoCreateModal from '@/components/processos/ProcessoCreateModal';

import ProcessosOmniLayout from '@/components/processos/ProcessosOmniLayout';
import ProcessoDetailsPanel from '@/components/processos/ProcessoDetailsPanel';
import LoadingState from '@/components/common/LoadingState';
import { useLocation } from 'react-router-dom';
import { useProcessosData } from '@/components/processos/hooks/useProcessosData';
import { useProcessosActions } from '@/components/processos/hooks/useProcessosActions';
import { useProcessosFilters } from '@/components/processos/hooks/useProcessosFilters';
import { useInstrumentedFunctions } from '@/components/hooks/useInstrumentedFunctions';
import { reportCustomError } from '@/components/debug/ErrorLogger';
import { usePerformanceTracker } from '@/components/hooks/usePerformanceTracker';
import { useUXTracker } from '@/components/hooks/useUXTracker';
import { InstrumentedErrorBoundary } from '@/components/debug/InstrumentedErrorBoundary';

export default function Processos() {
  usePerformanceTracker('Processos');
  useUXTracker();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { invoke } = useInstrumentedFunctions();
  const [filtros, setFiltros] = useState({ status: 'todos', cliente_id: 'todos', publicacao: 'todos' });
  const [showModal, setShowModal] = useState(false);
  const [processoSelecionado, setProcessoSelecionado] = useState(null);

  const { processos, clientes, escritorio, isLoading } = useProcessosData();
  const { createMutation, bulkArchive, bulkDelete } = useProcessosActions(escritorio?.id);
  
  // Buscar publicações para filtro
  const { data: publicacoes = [], isError: publicacoesError } = useQuery({
    queryKey: ['publicacoes', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      try {
        return await base44.entities.PublicacaoProcesso.filter({ 
          escritorio_id: escritorio.id 
        }, '-data', 5000);
      } catch (error) {
        console.error('Erro ao carregar publicações:', error);
        return [];
      }
    },
    enabled: !!escritorio?.id,
    staleTime: 5 * 60 * 1000
  });

  const processosFiltrados = useProcessosFilters(processos, clientes, '', filtros, publicacoes);

  const handleSubmit = (data) => {
    createMutation.mutate(data);
    setShowModal(false);
  };

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('new') === 'true') {
      setShowModal(true);
      window.history.replaceState({}, '', createPageUrl('Processos'));
    }
  }, [location.search]);



  if (isLoading) return <LoadingState message="Carregando processos..." />;

  return (
    <InstrumentedErrorBoundary category="ROUTES">
      <div className="min-h-screen bg-[var(--bg-secondary)] pb-20 md:pb-0">
      
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-6">
        <div className="space-y-3 md:space-y-6">
          <ProcessosHeader 
            totalProcessos={processosFiltrados.length} 
            onNovo={() => setShowModal(true)}
            onBuscar={() => navigate(createPageUrl('BuscaProcessos'))}
          />
          
          <div className="h-[calc(100vh-200px)]">
            <ProcessosOmniLayout
              processos={processosFiltrados}
              filtros={filtros}
              onFiltrosChange={setFiltros}
              processoSelecionado={processoSelecionado}
              onSelectProcesso={setProcessoSelecionado}
              detailsComponent={ProcessoDetailsPanel}
              clientes={clientes}
            />
          </div>
        </div>
      </div>

      <ProcessoCreateModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onSubmit={handleSubmit}
        onSuccess={() => {
          queryClient.invalidateQueries(['processos']);
          toast.success('Processo(s) criado(s) com sucesso!');
        }}
      />


    </div>
    </InstrumentedErrorBoundary>
  );
}