import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard } from "lucide-react";
import ModuleHeader from "@/components/cliente/ModuleHeader";
import FaturaCardCliente from "@/components/cliente/FaturaCardCliente";
import FaturasEmptyState from "@/components/cliente/FaturasEmptyState";
import FaturasSecureBadge from "@/components/cliente/FaturasSecureBadge";
import PersistentCTABanner from "@/components/cliente/PersistentCTABanner";
import ResumeLoader from "@/components/common/ResumeLoader";

export default function MinhasFaturas() {
  const navigate = useNavigate();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
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

  const { data: honorarios = [], isLoading: loadingHonorarios } = useQuery({
    queryKey: ['meus-honorarios', cliente?.id, escritorio?.id],
    queryFn: async () => {
      if (!cliente?.id || !escritorio?.id) return [];
      return base44.entities.Honorario.filter({ 
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
        title="Minhas Faturas"
        breadcrumbItems={[
          { label: 'Painel', url: createPageUrl('MeuPainel') },
          { label: 'Faturas' }
        ]}
        icon={CreditCard}
        statusBadge="PAGAMENTO SEGURO"
        action={<FaturasSecureBadge />}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-32 md:pb-6">
        {loadingHonorarios ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : honorarios.length === 0 ? (
          <FaturasEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {honorarios.map((honorario) => (
              <FaturaCardCliente 
                key={honorario.id} 
                honorario={honorario} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}