import React from "react";
import KPICard from "@/components/dashboard/admin/KPICard";
import KPICardSkeleton from "@/components/dashboard/admin/KPICardSkeleton";
import { FileText, Users, MessageSquare, DollarSign, Calendar, Clock } from "lucide-react";

export default function DashboardKPIGrid({ 
  processos = [], 
  clientes = [], 
  tickets = [], 
  honorarios = [],
  prazos = [],
  leads = [],
  isLoading = false 
}) {
  const receitaMes = honorarios
    .filter(h => h.status === 'pago' && h.created_date?.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((s, h) => s + (h.valor_pago || 0), 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      <KPICard
        label="Processos Ativos"
        value={processos.length}
        icon={FileText}
        color="blue"
      />
      <KPICard
        label="Clientes Ativos"
        value={clientes.length}
        icon={Users}
        color="brand"
      />
      <KPICard
        label="Tickets Abertos"
        value={tickets.length}
        icon={MessageSquare}
        color={tickets.length > 5 ? 'red' : 'amber'}
      />
      <KPICard
        label="Receita do Mês"
        value={`R$ ${(receitaMes / 1000).toFixed(1)}k`}
        icon={DollarSign}
        color="green"
      />
      <KPICard
        label="Prazos Críticos"
        value={prazos.length}
        icon={Clock}
        color={prazos.length > 0 ? 'red' : 'green'}
      />
      <KPICard
        label="Leads Novos"
        value={leads.filter(l => l.status === 'novo').length}
        icon={Calendar}
        color="amber"
      />
    </div>
  );
}