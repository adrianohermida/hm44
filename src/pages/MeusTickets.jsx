import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus, ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TicketCardCliente from "@/components/cliente/TicketCardCliente";
import TicketsEmptyState from "@/components/cliente/TicketsEmptyState";
import NovoTicketModal from "@/components/cliente/NovoTicketModal";


export default function MeusTickets() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: tickets = [], isLoading: loadingTickets, refetch: refetchTickets } = useQuery({
    queryKey: ['meus-tickets', user?.email, escritorio?.id],
    queryFn: async () => {
      if (!user || !escritorio?.id) return [];
      const result = await base44.entities.Ticket.filter({ 
        escritorio_id: escritorio.id,
        cliente_email: user.email
      });
      return result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!user && !!escritorio?.id
  });

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com Volta */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => navigate(createPageUrl('MeuPainel'))}
            className="gap-2 text-[var(--brand-primary)]"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </Button>
        </div>

        {/* Title e Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            Suporte ao Cliente
          </h1>
          <Button onClick={() => setModalOpen(true)} className="w-full sm:w-auto bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]">
            <Plus className="w-4 h-4 mr-2" />
            Novo Chamado
          </Button>
        </div>

        {/* Tickets Grid */}
        {loadingTickets ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40 md:h-48 w-full" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <TicketsEmptyState onNovoChamado={() => setModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {tickets.map((ticket) => (
              <TicketCardCliente 
                key={ticket.id} 
                ticket={ticket} 
              />
            ))}
          </div>
        )}
      </div>

      <NovoTicketModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refetchTickets();
        }}
        user={user}
        escritorioId={escritorio?.id}
      />
    </div>
  );
}