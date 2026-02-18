import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard } from "lucide-react";
import PlanoCardCliente from "@/components/cliente/PlanoCardCliente";

export default function PagamentoTab({ user }) {
  const { data: planos = [], isLoading } = useQuery({
    queryKey: ['meus-planos', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const clientesList = await base44.entities.Cliente.filter({ email: user.email });
      if (clientesList.length === 0) return [];
      const ids = clientesList.map(c => c.id);
      const all = await base44.entities.PlanoPagamento.list();
      return all.filter(p => ids.includes(p.cliente_id));
    },
    enabled: !!user
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg sm:text-2xl font-bold text-[var(--text-primary)]">Plano de Pagamento</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : planos.length === 0 ? (
        <Card className="bg-[var(--bg-elevated)]">
          <CardContent className="py-12 text-center">
            <CreditCard className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3 opacity-50" />
            <p className="text-sm text-[var(--text-secondary)]">Você não possui planos de pagamento ativos.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {planos.map((p) => <PlanoCardCliente key={p.id} plano={p} />)}
        </div>
      )}
    </div>
  );
}