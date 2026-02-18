import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { useConsultaLeads } from '@/components/hooks/useConsultaLeads';
import ConsultaHeader from '@/components/consultas/ConsultaHeader';
import ConsultaGrid from '@/components/consultas/ConsultaGrid';
import CalendarPanel from '@/components/calendar/CalendarPanel';
import LoadingState from '@/components/common/LoadingState';
import Breadcrumb from '@/components/seo/Breadcrumb';

export default function GerenciarConsultas() {
  const navigate = useNavigate();
  const { leads, loading, filter, setFilter, aproveLead, rejectLead, scheduleLead } = useConsultaLeads();

  if (loading && leads.length === 0) return <LoadingState message="Carregando consultas..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={[{ label: 'Consultas' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <ConsultaHeader 
            leads={leads}
            filter={filter}
            onFilterChange={setFilter}
          />
          <Button onClick={() => navigate(createPageUrl('AgendarConsulta'))} className="bg-[var(--brand-primary)] w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nova Consulta
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ConsultaGrid
              leads={leads}
              onApprove={aproveLead}
              onReject={rejectLead}
              onSchedule={scheduleLead}
            />
          </div>
          <div className="lg:col-span-1">
            <CalendarPanel />
          </div>
        </div>
      </div>
    </div>
  );
}