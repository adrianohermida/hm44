import React from 'react';
import { createPageUrl } from '@/utils';
import { usePerformanceTracker } from '@/components/hooks/usePerformanceTracker';
import { useUXTracker } from '@/components/hooks/useUXTracker';
import PageHeader from '@/components/layout/PageHeader';
import CardGrid from '@/components/layout/CardGrid';
import ModuleCard from '@/components/layout/ModuleCard';
import { Users, Target, Briefcase, Calendar, CreditCard, MessageSquare } from 'lucide-react';

export default function PessoasPage() {
  usePerformanceTracker('Pessoas');
  useUXTracker();
  
  return (
    <div className="p-4 md:p-6">
      <CardGrid>
        <ModuleCard
          icon={Users}
          title="Clientes"
          description="Lista e gestão completa de clientes."
          url={createPageUrl('Clientes')}
        />
        <ModuleCard
          icon={Target}
          title="Solicitações"
          description="Gerencie seus potenciais clientes."
          url={createPageUrl('Leads')}
        />
        <ModuleCard
          icon={Briefcase}
          title="Oportunidades"
          description="Acompanhe suas oportunidades de vendas."
          url={createPageUrl('PipelineCRM')}
        />
        <ModuleCard
          icon={Calendar}
          title="Consultas"
          description="Agendamentos e histórico de consultas."
          url={createPageUrl('GerenciarConsultas')}
        />
        <ModuleCard
          icon={CreditCard}
          title="Planos Pagamento"
          description="Gerencie planos de pagamento de clientes."
          url={createPageUrl('PlanosPagamento')}
        />
        <ModuleCard
          icon={MessageSquare}
          title="Follow-ups"
          description="Acompanhe interações com clientes."
          url={createPageUrl('FollowUps')}
        />
      </CardGrid>
    </div>
  );
}