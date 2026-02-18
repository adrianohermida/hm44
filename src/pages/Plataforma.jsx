import React from 'react';
import { createPageUrl } from '@/utils';
import PageHeader from '@/components/layout/PageHeader';
import CardGrid from '@/components/layout/CardGrid';
import ModuleCard from '@/components/layout/ModuleCard';
import { Target, Shield } from 'lucide-react';

export default function PlataformaPage() {
  const breadcrumbs = [
    { label: 'Home', url: createPageUrl('Home') },
    { label: 'Plataforma', url: createPageUrl('Plataforma') },
  ];

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Plataforma"
        description="Testes, auditoria e gestão de acessos da plataforma."
        breadcrumbs={breadcrumbs}
      />
      <CardGrid>
        <ModuleCard
          icon={Target}
          title="Testes E2E"
          description="Execute testes de integração e validação."
          url={createPageUrl('E2ETesting')}
        />
        <ModuleCard
          icon={Shield}
          title="Auditoria"
          description="Auditoria de navegação e segurança."
          url={createPageUrl('AuditoriaNavegacao')}
        />
        <ModuleCard
          icon={Shield}
          title="Aceites Eletrônicos"
          description="Gerencie consentimentos e aceites de termos."
          url={createPageUrl('AceitesEletronicos')}
        />
      </CardGrid>
    </div>
  );
}