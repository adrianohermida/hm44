import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import LeadsHeader from '@/components/crm/LeadsHeader';
import LeadsSidebar from '@/components/crm/LeadsSidebar';
import LeadDetail from '@/components/crm/LeadDetail';
import LoadingState from '@/components/common/LoadingState';

export default function Leads() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
  
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', escritorio?.id],
    queryFn: () => base44.entities.Lead.filter({ escritorio_id: escritorio.id }, '-created_date'),
    enabled: !!escritorio
  });

  const filteredLeads = leads.filter(l => filter === 'all' || l.temperatura === filter);

  if (isLoading) return <LoadingState message="Carregando leads..." />;

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-[var(--border-primary)] bg-[var(--bg-elevated)]">
        <Breadcrumb items={[
          { label: 'Marketing', url: createPageUrl('Marketing') },
          { label: 'Leads' }
        ]} />
        <LeadsHeader 
          count={filteredLeads.length}
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <LeadsSidebar
          leads={filteredLeads}
          selected={selected}
          onSelect={setSelected}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          loading={isLoading}
        />
        <LeadDetail lead={selected} />
      </div>
    </div>
  );
}