import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { TrendingUp } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import PipelineKanban from '@/components/crm/PipelineKanban';
import LoadingState from '@/components/common/LoadingState';

export default function PipelineCRM() {
  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    },
    enabled: !!user
  });

  if (!escritorio) return <LoadingState message="Carregando pipeline..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={[
            { label: 'Marketing', url: createPageUrl('Marketing') },
            { label: 'Pipeline' }
          ]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[var(--brand-primary)]" />
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Pipeline de Vendas</h1>
          </div>
          <p className="text-[var(--text-secondary)] mt-2">
            Gerencie suas oportunidades através do funil de vendas
          </p>
        </header>

        <PipelineKanban escritorioId={escritorio.id} />
      </div>
    </div>
  );
}