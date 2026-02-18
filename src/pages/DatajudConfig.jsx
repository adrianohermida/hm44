import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Settings, History, Zap, BarChart3, FileSpreadsheet, Building2, Upload } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import DatajudSyncManager from '@/components/conectores/datajud/DatajudSyncManager';
import DatajudSyncReports from '@/components/conectores/datajud/DatajudSyncReports';
import DatajudAnalytics from '@/components/conectores/datajud/DatajudAnalytics';
import StreamCSVImporter from '@/components/conectores/datajud/StreamCSVImporter';
import ServentiasTable from '@/components/conectores/datajud/ServentiasTable';
import JuizosTable from '@/components/conectores/datajud/JuizosTable';
import CNJParserWidget from '@/components/conectores/datajud/CNJParserWidget';
import TPUBuscaWidget from '@/components/conectores/datajud/TPUBuscaWidget';
import CodigoForoImporter from '@/components/conectores/datajud/CodigoForoImporter';
import PainelSincronizacao from '@/components/conectores/datajud/PainelSincronizacao';
import LogsSincronizacao from '@/components/conectores/datajud/LogsSincronizacao';
import HistoricoTestesDatajud from '@/components/conectores/datajud/HistoricoTestesDatajud';
import SchemasCatalogados from '@/components/conectores/datajud/SchemasCatalogados';
import BuscaJuizos from '@/components/conectores/datajud/BuscaJuizos';
import ImportadorTPUPostgres from '@/components/conectores/datajud/ImportadorTPUPostgres';
import GestaoEndpointsDatajud from '@/components/conectores/datajud/GestaoEndpointsDatajud';
import MonitoramentoSaudeEndpoints from '@/components/conectores/datajud/MonitoramentoSaudeEndpoints';
import PainelErrosDatajud from '@/components/conectores/datajud/PainelErrosDatajud';
import DashboardPersonalizavel from '@/components/conectores/datajud/DashboardPersonalizavel';
import ValidadorDadosImportados from '@/components/conectores/datajud/ValidadorDadosImportados';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

export default function DatajudConfig() {
  const [activeTab, setActiveTab] = useState('sync');
  
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const handleSeedEndpoints = async () => {
    try {
      const response = await base44.functions.invoke('seedEndpointsDatajudCompleto');
      if (response.data.success) {
        toast.success(`${response.data.criados} endpoints criados, ${response.data.atualizados} atualizados`);
      }
    } catch (error) {
      toast.error('Erro ao importar endpoints');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb 
          items={[
            { label: 'Configurações', url: createPageUrl('Configuracoes') },
            { label: 'DataJud' }
          ]} 
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Integração DataJud CNJ
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Sincronização automática com API pública do CNJ
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="sync">
                <Database className="w-4 h-4 mr-2" />
                Sincronização
              </TabsTrigger>
              <TabsTrigger value="busca">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Busca CNJ
              </TabsTrigger>
              <TabsTrigger value="juizos">
                <Building2 className="w-4 h-4 mr-2" />
                Juízos
              </TabsTrigger>
              <TabsTrigger value="tpu">
                <Database className="w-4 h-4 mr-2" />
                TPU CNJ
              </TabsTrigger>
              <TabsTrigger value="importar">
                <Upload className="w-4 h-4 mr-2" />
                Importar CNJ
              </TabsTrigger>
              <TabsTrigger value="schemas">
                <Database className="w-4 h-4 mr-2" />
                Schemas
              </TabsTrigger>
              <TabsTrigger value="historico">
                <History className="w-4 h-4 mr-2" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="painel">
                <Settings className="w-4 h-4 mr-2" />
                Painel de Controle
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

          <TabsContent value="sync">
            <div className="space-y-6">
              <DatajudSyncReports />
              <DatajudSyncManager darkMode={false} />
            </div>
          </TabsContent>

          <TabsContent value="busca">
            <CNJParserWidget />
          </TabsContent>

          <TabsContent value="juizos">
            <BuscaJuizos escritorioId={escritorio?.id} />
          </TabsContent>

          <TabsContent value="tpu">
            <TPUBuscaWidget />
          </TabsContent>

          <TabsContent value="importar">
            <div className="space-y-6">
              <ImportadorTPUPostgres />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>📌 Uso:</strong> Importe tabelas oficiais CNJ para enriquecer automaticamente processos com dados de serventias, varas e juízos.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CodigoForoImporter />
                <StreamCSVImporter
                  entityName="ServentiaCNJ"
                  schemaType="ServentiaCNJ"
                  title="Importar Serventias CNJ"
                  description="Streaming real-time + validação"
                />
                <StreamCSVImporter
                  entityName="JuizoCNJ"
                  schemaType="JuizoCNJ"
                  title="Importar Juízos CNJ"
                  description="Processamento em lote"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="painel">
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={handleSeedEndpoints} variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Cadastrar Endpoints DataJud
                </Button>
              </div>
              <PainelSincronizacao escritorioId={escritorio?.id} />
              <LogsSincronizacao escritorioId={escritorio?.id} />
            </div>
          </TabsContent>

          <TabsContent value="schemas">
            <div className="space-y-6">
              <SchemasCatalogados escritorioId={escritorio?.id} />
              <GestaoEndpointsDatajud escritorioId={escritorio?.id} />
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <HistoricoTestesDatajud escritorioId={escritorio?.id} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <DashboardPersonalizavel escritorioId={escritorio?.id} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonitoramentoSaudeEndpoints escritorioId={escritorio?.id} />
                <PainelErrosDatajud escritorioId={escritorio?.id} />
              </div>
              <ValidadorDadosImportados escritorioId={escritorio?.id} />
              <DatajudAnalytics darkMode={false} />
            </div>
          </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}