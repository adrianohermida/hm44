import React from 'react';
import { createPageUrl } from '@/utils';
import PageHeader from '@/components/layout/PageHeader';
import CardGrid from '@/components/layout/CardGrid';
import ModuleCard from '@/components/layout/ModuleCard';
import { Target, TrendingUp, Bell } from 'lucide-react';

export default function ConectoresPage() {
  const breadcrumbs = [
    { label: 'Home', url: createPageUrl('Home') },
    { label: 'Conectores', url: createPageUrl('Conectores') },
  ];

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Conectores & APIs"
        description="Gerencie integrações, endpoints e monitoramento de APIs externas."
        breadcrumbs={breadcrumbs}
      />
      <CardGrid>
        <ModuleCard
          icon={Target}
          title="Provedores"
          description="Gerencie provedores de APIs externas."
          url={createPageUrl('AdminProvedores')}
        />
        <ModuleCard
          icon={Target}
          title="Endpoints"
          description="Configure e gerencie endpoints de integração."
          url={createPageUrl('AdminEndpoints')}
        />
        <ModuleCard
          icon={TrendingUp}
          title="Precificador"
          description="Configure precificação de serviços de API."
          url={createPageUrl('Precificador')}
        />
        <ModuleCard
          icon={Target}
          title="Gestão de Testes de API"
          description="Execute testes, visualize histórico e resultados."
          url={createPageUrl('AdminTestes')}
        />
        <ModuleCard
          icon={Bell}
          title="Alertas"
          description="Configure alertas e notificações de API."
          url={createPageUrl('ConfiguracaoAlertas')}
        />
      </CardGrid>
    </div>
  );
}