import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useErrorReporting } from '@/components/hooks/useErrorReporting';
import { usePerformanceTracker } from '@/components/hooks/usePerformanceTracker';
import { useUXTracker } from '@/components/hooks/useUXTracker';
import { InstrumentedErrorBoundary } from '@/components/debug/InstrumentedErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ClienteAvatarHeader from '@/components/clientes/detalhes/ClienteAvatarHeader';
import ClienteTabsSection from '@/components/clientes/detalhes/ClienteTabsSection';
import DadosClienteCard from '@/components/clientes/detalhes/DadosClienteCard';
import ClienteFormModal from '@/components/clientes/ClienteFormModal';
import VinculosList from '@/components/clientes/vinculos/VinculosList';
import AdicionarVinculoModal from '@/components/clientes/vinculos/AdicionarVinculoModal';
import LoadingState from '@/components/common/LoadingState';
import BuscarNoTribunalButton from '@/components/processos/detail/BuscarNoTribunalButton';
import ClienteOverviewStatsCompact from '@/components/clientes/detalhes/ClienteOverviewStatsCompact';
import ProximaConsultaCard from '@/components/clientes/detalhes/ProximaConsultaCard';
import HistoricoAtendimentosCard from '@/components/clientes/detalhes/HistoricoAtendimentosCard';
import NotasCard from '@/components/clientes/detalhes/NotasCard';
import ProcessoCreateModal from '@/components/processos/ProcessoCreateModal';
import DadosEnriquecidosPF from '@/components/clientes/detalhes/DadosEnriquecidosPF';
import DadosEnriquecidosPJ from '@/components/clientes/detalhes/DadosEnriquecidosPJ';

export default function ClienteDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const fromProcesso = params.get('fromProcesso');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { wrapQuery, wrapMutation } = useErrorReporting();
  
  // Debug: Log inicial
  React.useEffect(() => {
    console.log('[ClienteDetalhes] Component mounted/updated:', { 
      id, 
      fromProcesso, 
      url: window.location.href,
      searchParams: window.location.search 
    });
  }, [id, fromProcesso]);
  
  usePerformanceTracker('ClienteDetalhes');
  useUXTracker();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVinculoModal, setShowVinculoModal] = useState(false);
  const [showProcessoModal, setShowProcessoModal] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const { data: cliente, isLoading, error } = useQuery(wrapQuery({
    queryKey: ['cliente', id],
    queryFn: async () => {
      console.log('[ClienteDetalhes] Query iniciada:', { id, url: window.location.href });
      const clientes = await base44.entities.Cliente.filter({ id });
      console.log('[ClienteDetalhes] Query resultado:', { 
        found: clientes.length > 0, 
        count: clientes.length,
        firstCliente: clientes[0] ? { id: clientes[0].id, nome: clientes[0].nome_completo } : null,
        rawResponse: clientes
      });
      return clientes[0];
    },
    enabled: !!id,
    retry: 1,
    retryDelay: 2000,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  }, 'ENTITIES', 'cliente'));

  const { data: conjuge } = useQuery({
    queryKey: ['conjuge', cliente?.conjuge_id, id],
    queryFn: async () => {
      try {
        // Primeiro, verificar se há vínculo de cônjuge
        if (cliente.estado_civil === 'casado' || cliente.estado_civil === 'uniao_estavel') {
          const vinculo = await base44.entities.VinculoPFPJ.filter({
            pessoa_fisica_id: id,
            tipo_vinculo: 'conjuge',
            ativo: true
          }, undefined, 1);
          
          if (vinculo.length > 0 && vinculo[0].pessoa_juridica_id) {
            const c = await base44.entities.Cliente.filter({ id: vinculo[0].pessoa_juridica_id });
            if (c[0]) return { ...c[0], regime_bens: vinculo[0].regime_bens };
          }
        }
        
        // Fallback: verificar campo conjuge_id direto
        if (cliente?.conjuge_id) {
          const c = await base44.entities.Cliente.filter({ id: cliente.conjuge_id });
          return c[0] || null;
        }
        
        return null;
      } catch (error) {
        console.warn('Erro ao buscar cônjuge:', error);
        return null;
      }
    },
    enabled: !!cliente && !!id && (!!cliente.conjuge_id || cliente.estado_civil === 'casado' || cliente.estado_civil === 'uniao_estavel'),
    retry: 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  const { data: vinculos = [] } = useQuery({
    queryKey: ['vinculos', id],
    queryFn: async () => {
      const v1 = await base44.entities.VinculoPFPJ.filter({ pessoa_fisica_id: id });
      await new Promise(resolve => setTimeout(resolve, 500));
      const v2 = await base44.entities.VinculoPFPJ.filter({ pessoa_juridica_id: id });
      return [...v1, ...v2];
    },
    enabled: !!cliente && !!id,
    retry: 0,
    staleTime: 3 * 60 * 1000
  });

  const { data: todosClientes = [] } = useQuery({
    queryKey: ['all-clientes', escritorio?.id],
    queryFn: () => base44.entities.Cliente.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio?.id,
    staleTime: 5 * 60 * 1000
  });

  const updateClienteMutation = useMutation(wrapMutation({
    mutationFn: (data) => base44.entities.Cliente.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cliente']);
      setShowEditModal(false);
      toast.success('Cliente atualizado');
    }
  }, 'ENTITIES', 'atualizar cliente'));

  const addVinculoMutation = useMutation({
    mutationFn: (data) => {
      const vinculoData = {
        escritorio_id: cliente.escritorio_id,
        tipo_vinculo: data.tipo_vinculo,
        cargo: data.cargo,
        percentual_participacao: data.percentual_participacao ? parseFloat(data.percentual_participacao) : null,
        ativo: true
      };

      if (cliente.tipo_pessoa === 'fisica') {
        vinculoData.pessoa_fisica_id = id;
        vinculoData.pessoa_juridica_id = data.cliente_vinculado_id;
      } else {
        vinculoData.pessoa_juridica_id = id;
        vinculoData.pessoa_fisica_id = data.cliente_vinculado_id;
      }

      return base44.entities.VinculoPFPJ.create(vinculoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vinculos']);
      setShowVinculoModal(false);
      toast.success('Vínculo adicionado');
    }
  });

  const removeVinculoMutation = useMutation({
    mutationFn: (vinculoId) => base44.entities.VinculoPFPJ.delete(vinculoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['vinculos']);
      toast.success('Vínculo removido');
    }
  });

  const createProcessoMutation = useMutation({
    mutationFn: (data) => base44.entities.Processo.create({
      ...data,
      cliente_id: id,
      escritorio_id: escritorio?.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['processos-cliente']);
      queryClient.invalidateQueries(['processos-cliente-count']);
      setShowProcessoModal(false);
      toast.success('Processo criado com sucesso');
    }
  });

  const enriquecerMutation = useMutation(wrapMutation({
    mutationFn: async () => {
      console.log('[ClienteDetalhes] Enriquecendo dados:', { tipo: cliente.tipo_pessoa, cpf_cnpj: cliente.cpf_cnpj });
      
      if (!cliente.cpf_cnpj) {
        throw new Error('CPF/CNPJ não informado');
      }
      
      if (cliente.tipo_pessoa === 'fisica') {
        return await base44.functions.invoke('consultarCPFDirectData', { cpf: cliente.cpf_cnpj });
      } else {
        return await base44.functions.invoke('consultarCNPJDirectData', { cnpj: cliente.cpf_cnpj });
      }
    },
    onSuccess: (response) => {
      console.log('[ClienteDetalhes] Enriquecimento sucesso:', response);
      if (response?.data) {
        updateClienteMutation.mutate({ dados_enriquecidos_api: response.data });
      }
      queryClient.invalidateQueries(['cliente', id]);
      toast.success('Dados enriquecidos atualizados');
    },
    onError: (error) => {
      console.error('[ClienteDetalhes] Erro ao enriquecer:', error);
      toast.error(error?.response?.data?.error || error.message || 'Erro ao enriquecer dados');
    }
  }, 'FUNCTIONS', 'enriquecer dados do cliente'));

  const handleOpenChat = (cliente) => {
    const event = new CustomEvent('openChatWithClient', {
      detail: { 
        clienteEmail: cliente.email, 
        clienteNome: cliente.nome_completo 
      }
    });
    window.dispatchEvent(event);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)] h-[120px]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
        <LoadingState message="Carregando dados do cliente..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">Erro ao carregar cliente</p>
            <p className="text-sm text-[var(--text-secondary)] mb-4">{error.message}</p>
            <Button 
              onClick={() => {
                console.log('[ClienteDetalhes] Navigate to Clientes from error');
                navigate(createPageUrl('Clientes'));
              }}
            >
              Voltar para Clientes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!cliente) {
    console.warn('[ClienteDetalhes] Cliente não encontrado:', { 
      id, 
      isLoading, 
      error,
      url: window.location.href 
    });
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-[var(--text-secondary)] mb-4">Cliente não encontrado</p>
            <p className="text-xs text-gray-500 mb-4">ID: {id || 'não fornecido'}</p>
            <Button 
              onClick={() => {
                console.log('[ClienteDetalhes] Navigate to Clientes from not found');
                navigate(createPageUrl('Clientes'));
              }}
            >
              Voltar para Clientes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <InstrumentedErrorBoundary category="ROUTES">
      <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={[
            { label: 'Clientes', url: createPageUrl('Clientes') },
            { label: cliente?.nome_completo || 'Detalhes' }
          ]} />
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              console.log('[ClienteDetalhes] Navigate back clicked', { fromProcesso });
              navigate(fromProcesso ? `${createPageUrl('ProcessoDetails')}?id=${fromProcesso}` : createPageUrl('Clientes'));
            }}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - reservar altura mínima para evitar CLS */}
          <div className="lg:col-span-2 space-y-6" style={{ minHeight: '800px' }}>
            <ClienteAvatarHeader 
              cliente={cliente}
              onNovoProcesso={() => setShowProcessoModal(true)}
              onOpenChat={handleOpenChat}
            />

            <Button 
              onClick={() => setShowEditModal(true)}
              variant="outline"
              className="w-full mb-4"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Dados do Cliente
            </Button>

            <DadosClienteCard cliente={cliente} />
            
            <div className="bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {cliente.tipo_pessoa === 'fisica' ? 'Empresas Vinculadas' : 'Representantes e Sócios'}
                </h3>
                <Button 
                  size="sm" 
                  onClick={() => setShowVinculoModal(true)}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />Adicionar
                </Button>
              </div>
              <VinculosList
                vinculos={vinculos}
                clienteAtualId={id}
                clientes={todosClientes}
                onRemove={(id) => removeVinculoMutation.mutate(id)}
              />
            </div>

            <ClienteTabsSection 
              clienteId={id}
              escritorioId={cliente.escritorio_id}
              clienteEmail={cliente.email}
              clienteNome={cliente.nome_completo}
              clienteCpfCnpj={cliente.cpf_cnpj}
            />
          </div>
          
          {/* Sidebar - reservar altura mínima para evitar CLS */}
          <div className="lg:col-span-1 space-y-4" style={{ minHeight: '600px' }}>
            <ClienteOverviewStatsCompact
              clienteId={id}
              escritorioId={cliente.escritorio_id}
            />

            <ProximaConsultaCard
              clienteId={id}
              escritorioId={cliente.escritorio_id}
              onRegistrar={() => navigate(createPageUrl('AgendarConsulta'))}
            />

            <NotasCard
              clienteId={id}
              escritorioId={cliente.escritorio_id}
              notas={cliente.notas}
            />

            <NotasCard
              clienteId={id}
              escritorioId={cliente.escritorio_id}
              notas={cliente.notas}
            />

            {cliente.tipo_pessoa === 'fisica' ? (
              <DadosEnriquecidosPF 
                cliente={cliente}
                onEnriquecer={() => enriquecerMutation.mutate()}
                loading={enriquecerMutation.isPending}
              />
            ) : (
              <DadosEnriquecidosPJ 
                cliente={cliente}
                onEnriquecer={() => enriquecerMutation.mutate()}
                loading={enriquecerMutation.isPending}
              />
            )}

            <ProximaConsultaCard
              clienteId={id}
              escritorioId={cliente.escritorio_id}
              onRegistrar={() => navigate(createPageUrl('AgendarConsulta'))}
            />

            <HistoricoAtendimentosCard
              clienteId={id}
              escritorioId={cliente.escritorio_id}
              onRegistrar={() => handleOpenChat(cliente)}
            />
          </div>
        </div>
      </div>

      <ClienteFormModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        cliente={cliente}
        onSave={(data) => updateClienteMutation.mutate(data)}
      />

      <AdicionarVinculoModal
        open={showVinculoModal}
        onClose={() => setShowVinculoModal(false)}
        clienteAtual={cliente}
        clientes={todosClientes}
        onSave={(data) => addVinculoMutation.mutate(data)}
      />

      <ProcessoCreateModal
        open={showProcessoModal}
        onClose={() => setShowProcessoModal(false)}
        onSubmit={(data) => createProcessoMutation.mutate(data)}
        clienteId={id}
      />
    </div>
    </InstrumentedErrorBoundary>
  );
}