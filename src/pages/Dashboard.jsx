import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { InstrumentedErrorBoundary } from "@/components/debug/InstrumentedErrorBoundary";
import Breadcrumb from "@/components/seo/Breadcrumb";
import { createPageUrl } from "@/utils";
import ResumeLoader from "@/components/common/ResumeLoader";
import DashboardKPIGrid from "@/components/dashboard/admin/DashboardKPIGrid";
import AtividadeRecente from "@/components/dashboard/admin/AtividadeRecente";
import FinanceiroResumo from "@/components/dashboard/admin/FinanceiroResumo";
import PrazosAlerta from "@/components/dashboard/admin/PrazosAlerta";
import LeadsFunil from "@/components/dashboard/admin/LeadsFunil";
import TicketsResumo from "@/components/dashboard/admin/TicketsResumo";
import { useDynamicKPI } from "@/components/hooks/useDynamicKPI";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: escritorioList = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user,
  });
  const escritorio = escritorioList[0];

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate(createPageUrl('MeuPainel'));
    }
  }, [user, navigate]);

  const { 
    processos = [], 
    clientes = [], 
    tickets = [], 
    honorarios = [], 
    prazos = [], 
    leads = [], 
    isLoading: kpiLoading 
  } = useDynamicKPI(escritorio?.id);

  if (loadingUser) return <ResumeLoader />;
  if (user && user.role !== 'admin') return null;

  return (
    <InstrumentedErrorBoundary category="ROUTES">
      <div className="p-4 md:p-6 space-y-6">
        <Breadcrumb items={[{ label: 'Home', url: createPageUrl('Home') }, { label: 'Dashboard' }]} />

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Olá, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Visão geral do escritório em tempo real
          </p>
        </div>

        {/* KPIs */}
        <DashboardKPIGrid
          processos={processos}
          clientes={clientes}
          tickets={tickets}
          honorarios={honorarios}
          prazos={prazos}
          leads={leads}
          isLoading={kpiLoading}
        />

        {/* Row 2: Financeiro + Prazos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <FinanceiroResumo escritorioId={escritorio?.id} />
          <PrazosAlerta escritorioId={escritorio?.id} />
        </div>

        {/* Row 3: Tickets + Leads + Atividade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <TicketsResumo escritorioId={escritorio?.id} />
          <LeadsFunil escritorioId={escritorio?.id} />
          <AtividadeRecente escritorioId={escritorio?.id} />
        </div>
      </div>
    </InstrumentedErrorBoundary>
  );
}