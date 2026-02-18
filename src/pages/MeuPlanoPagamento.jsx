import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign } from "lucide-react";
import ModuleHeader from "@/components/cliente/ModuleHeader";
import PlanoCardCliente from "@/components/cliente/PlanoCardCliente";
import PlanoEmptyState from "@/components/cliente/PlanoEmptyState";
import PlanoBadgeLei from "@/components/cliente/PlanoBadgeLei";
import PersistentCTABanner from "@/components/cliente/PersistentCTABanner";
import ResumeLoader from "@/components/common/ResumeLoader";

export default function MeuPlanoPagamento() {
  const navigate = useNavigate();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['user-escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: cliente } = useQuery({
    queryKey: ['user-cliente', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const clientes = await base44.entities.Cliente.filter({ email: user.email });
      return clientes[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: planos = [], isLoading: loadingPlanos } = useQuery({
    queryKey: ['meus-planos', cliente?.id, escritorio?.id],
    queryFn: async () => {
      if (!cliente?.id || !escritorio?.id) return [];
      return base44.entities.PlanoPagamento.filter({ 
        escritorio_id: escritorio.id,
        cliente_id: cliente.id
      });
    },
    enabled: !!cliente?.id && !!escritorio?.id
  });

  if (loadingUser) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <PersistentCTABanner />
      
      <ModuleHeader
        title="Plano de Pagamento"
        breadcrumbItems={[
          { label: 'Painel', url: createPageUrl('MeuPainel') },
          { label: 'Plano de Pagamento' }
        ]}
        icon={DollarSign}
        action={<PlanoBadgeLei />}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-32 md:pb-6">
        {loadingPlanos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : planos.length === 0 ? (
          <PlanoEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {planos.map((plano) => (
              <PlanoCardCliente 
                key={plano.id} 
                plano={plano} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}