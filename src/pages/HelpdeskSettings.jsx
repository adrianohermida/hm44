import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, Database, Settings, Zap, Calendar } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import DepartamentosManager from '@/components/helpdesk/settings/DepartamentosManager';
import TemplatesManager from '@/components/helpdesk/settings/TemplatesManager';
import BaseConhecimentoManager from '@/components/helpdesk/settings/BaseConhecimentoManager';
import SLAConfigManager from '@/components/helpdesk/settings/SLAConfigManager';
import AutoRespostaConfig from '@/components/helpdesk/settings/AutoRespostaConfig';
import RelatorioMensalConfig from '@/components/helpdesk/settings/RelatorioMensalConfig';

export default function HelpdeskSettings() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb 
          items={[
            { label: 'Atendimento', url: createPageUrl('Helpdesk') },
            { label: 'Configurações' }
          ]} 
        />

        <h1 className="text-3xl font-bold text-[var(--text-primary)] mt-6 mb-8">
          Configurações de Atendimento
        </h1>

        <Tabs defaultValue="departamentos">
          <TabsList>
            <TabsTrigger value="departamentos">
              <Users className="w-4 h-4 mr-2" />
              Departamentos
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="base">
              <Database className="w-4 h-4 mr-2" />
              Base de Conhecimento
            </TabsTrigger>
            <TabsTrigger value="sla">
              <Settings className="w-4 h-4 mr-2" />
              SLA
            </TabsTrigger>
            <TabsTrigger value="auto">
              <Zap className="w-4 h-4 mr-2" />
              Auto-Resposta
            </TabsTrigger>
            <TabsTrigger value="relatorios">
              <Calendar className="w-4 h-4 mr-2" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="departamentos">
            <DepartamentosManager />
          </TabsContent>

          <TabsContent value="templates">
            <TemplatesManager />
          </TabsContent>

          <TabsContent value="base">
            <BaseConhecimentoManager />
          </TabsContent>

          <TabsContent value="sla">
            <SLAConfigManager />
          </TabsContent>

          <TabsContent value="auto">
            {escritorio && <AutoRespostaConfig escritorioId={escritorio.id} />}
          </TabsContent>

          <TabsContent value="relatorios">
            {escritorio && <RelatorioMensalConfig escritorioId={escritorio.id} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}