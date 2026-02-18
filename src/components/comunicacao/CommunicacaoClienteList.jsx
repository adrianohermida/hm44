import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ComunicacaoClienteList({ user, onSelectConversa, selectedConversaId }) {
  const { data: conversas = [], isLoading } = useQuery({
    queryKey: ['conversas-cliente', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const clientesList = await base44.entities.Cliente.filter({ email: user.email });
      if (clientesList.length === 0) return [];
      const ids = clientesList.map(c => c.id);
      const all = await base44.entities.Conversa.list();
      return all
        .filter(c => ids.includes(c.cliente_id))
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (conversas.length === 0) {
    return (
      <Card className="bg-[var(--bg-elevated)]">
        <CardContent className="py-12 text-center">
          <MessageSquare className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2 opacity-50" />
          <p className="text-sm text-[var(--text-secondary)]">Nenhuma conversa ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {conversas.map((conversa) => (
        <button
          key={conversa.id}
          onClick={() => onSelectConversa(conversa)}
          className={`w-full text-left p-3 rounded-lg border transition-colors ${
            selectedConversaId === conversa.id
              ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]'
              : 'bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:border-[var(--brand-primary)]'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm text-[var(--text-primary)] truncate">
              {conversa.assunto || 'Sem assunto'}
            </h4>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {conversa.status || 'aberta'}
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
            {conversa.descricao || 'Sem descrição'}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            {new Date(conversa.created_date).toLocaleDateString('pt-BR')}
          </p>
        </button>
      ))}
    </div>
  );
}