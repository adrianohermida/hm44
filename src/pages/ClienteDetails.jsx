import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Upload, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import ClienteHeaderCard from '@/components/clientes/detalhes/ClienteHeaderCard';
import ClienteOverviewStats from '@/components/clientes/detalhes/ClienteOverviewStats';
import ProximaConsultaCard from '@/components/clientes/detalhes/ProximaConsultaCard';
import HistoricoAtendimentosCard from '@/components/clientes/detalhes/HistoricoAtendimentosCard';
import FinanceiroSummaryCard from '@/components/clientes/detalhes/FinanceiroSummaryCard';
import PendenciasCard from '@/components/clientes/detalhes/PendenciasCard';
import NotasCard from '@/components/clientes/detalhes/NotasCard';
import ClienteInfoSection from '@/components/clientes/detalhes/ClienteInfoSection';
import HistoricoClinicoTab from '@/components/clientes/detalhes/HistoricoClinicoTab';
import DocumentosTab from '@/components/clientes/detalhes/DocumentosTab';
import ComunicacaoTab from '@/components/clientes/detalhes/ComunicacaoTab';

export default function ClienteDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clienteId = searchParams.get('id');
  const fromProcesso = searchParams.get('fromProcesso');
  const [activeTab, setActiveTab] = useState('dados');

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: cliente, isLoading } = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn: async () => {
      const data = await base44.entities.Cliente.filter({
        id: clienteId,
        escritorio_id: escritorio.id
      });
      return data[0];
    },
    enabled: !!clienteId && !!escritorio
  });

  const handleVoltar = () => {
    if (fromProcesso) {
      navigate(createPageUrl('ProcessoDetails') + `?id=${fromProcesso}`);
    } else {
      navigate(createPageUrl('Clientes'));
    }
  };

  const handleNovoProntuario = () => {
    toast.info('Funcionalidade de prontuário em desenvolvimento');
  };

  const handleRegistrarConsulta = () => {
    navigate(createPageUrl('AgendarConsulta') + `?clienteId=${clienteId}`);
  };

  const handleRegistrarTicket = () => {
    toast.info('Abrindo novo ticket...');
  };

  const handleEditCliente = () => {
    toast.info('Modal de edição em desenvolvimento');
  };

  if (isLoading || !cliente) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded" />
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb / Back Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoltar}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {fromProcesso ? 'Voltar ao Processo' : 'Voltar'}
          </Button>
        </div>

        {/* Header */}
        <ClienteHeaderCard
          cliente={cliente}
          onNovoProntuario={handleNovoProntuario}
        />

        {/* Layout Principal */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Conteúdo Principal (2 colunas) */}
          <div className="md:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dados" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Dados
                </TabsTrigger>
                <TabsTrigger value="historico" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Histórico
                </TabsTrigger>
                <TabsTrigger value="documentos" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="comunicacao" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comunicação
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dados" className="mt-6">
                <ClienteInfoSection
                  cliente={cliente}
                  onEdit={handleEditCliente}
                />
              </TabsContent>

              <TabsContent value="historico" className="mt-6">
                <HistoricoClinicoTab
                  clienteId={clienteId}
                  escritorioId={escritorio?.id}
                />
              </TabsContent>

              <TabsContent value="documentos" className="mt-6">
                <DocumentosTab
                  clienteId={clienteId}
                  escritorioId={escritorio?.id}
                />
              </TabsContent>

              <TabsContent value="comunicacao" className="mt-6">
                <ComunicacaoTab
                  clienteId={clienteId}
                  escritorioId={escritorio?.id}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Direita (1 coluna) */}
          <div className="space-y-4 lg:self-start">
            <ClienteOverviewStats
              clienteId={clienteId}
              escritorioId={escritorio?.id}
            />
            
            <ProximaConsultaCard
              clienteId={clienteId}
              escritorioId={escritorio?.id}
              onRegistrar={handleRegistrarConsulta}
            />
            
            <FinanceiroSummaryCard
              clienteId={clienteId}
              escritorioId={escritorio?.id}
            />
            
            <PendenciasCard
              clienteId={clienteId}
              escritorioId={escritorio?.id}
              onAdicionar={() => toast.info('Adicionar tarefa')}
            />
            
            <NotasCard
              clienteId={clienteId}
              escritorioId={escritorio?.id}
              notas={cliente.notas}
            />
            
            <HistoricoAtendimentosCard
              clienteId={clienteId}
              escritorioId={escritorio?.id}
              onRegistrar={handleRegistrarTicket}
            />
          </div>
        </div>
      </div>
    </div>
  );
}