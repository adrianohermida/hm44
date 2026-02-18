import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ModuleHeader from "@/components/cliente/ModuleHeader";
import ProcessoCardCliente from "@/components/cliente/ProcessoCardCliente";
import ProcessosEmptyState from "@/components/cliente/ProcessosEmptyState";
import ProcessosSyncBadge from "@/components/cliente/ProcessosSyncBadge";
import BannerSolicitacaoCopia from "@/components/cliente/BannerSolicitacaoCopia";
import PersistentCTABanner from "@/components/cliente/PersistentCTABanner";
import ResumeLoader from "@/components/common/ResumeLoader";

export default function MeusProcessos() {
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

  const { data: processos = [], isLoading: loadingProcessos } = useQuery({
    queryKey: ['meus-processos-page', user?.email, escritorio?.id, cliente?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      const todos = await base44.entities.Processo.filter({ escritorio_id: escritorio.id });
      if (cliente?.id) {
        return todos.filter(p => p.cliente_id === cliente.id);
      }
      return todos.filter(p => p.created_by === user?.email);
    },
    enabled: !!escritorio?.id && !!user
  });

  if (loadingUser) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <PersistentCTABanner />
      
      <ModuleHeader
        title="Meus Processos"
        breadcrumbItems={[
          { label: 'Painel', url: createPageUrl('MeuPainel') },
          { label: 'Processos' }
        ]}
        icon={FileText}
        action={<ProcessosSyncBadge />}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-32 md:pb-6">
        {loadingProcessos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : processos.length === 0 ? (
          <ProcessosEmptyState />
        ) : (
          <>
            {processos.length > 0 && (
              <BannerSolicitacaoCopia 
                processo={processos[0]} 
                processosApensos={processos.slice(1)}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {processos.map((processo) => (
                <ProcessoCardCliente 
                  key={processo.id} 
                  processo={processo} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}