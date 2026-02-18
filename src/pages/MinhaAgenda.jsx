import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Plus, Scale } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AgendamentoCardCliente from "@/components/cliente/AgendamentoCardCliente";
import AgendamentosEmptyState from "@/components/cliente/AgendamentosEmptyState";
import NovoAgendamentoModal from "@/components/cliente/NovoAgendamentoModal";

// Inline AudienciaCardCliente (moved to bottom)

export default function MinhaAgenda() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0] || null;
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

  const { data: agendamentos = [], isLoading: loadingAgendamentos, refetch } = useQuery({
    queryKey: ['meus-agendamentos', user?.email, escritorio?.id],
    queryFn: async () => {
      if (!user || !escritorio?.id) return [];
      const all = await base44.entities.CalendarAvailability.filter({
        escritorio_id: escritorio.id,
        cliente_email: user.email
      });
      return all.sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
    },
    enabled: !!user && !!escritorio?.id
  });

  const { data: audiencias = [], isLoading: loadingAudiencias } = useQuery({
    queryKey: ['meus-audiencias-agenda', cliente?.id, escritorio?.id],
    queryFn: async () => {
      if (!cliente?.id || !escritorio?.id) return [];
      const processos = await base44.entities.Processo.filter({ 
        escritorio_id: escritorio.id, 
        cliente_id: cliente.id 
      });
      const processosIds = processos.map(p => p.id);
      if (!processosIds.length) return [];
      const todas = await base44.entities.Audiencia.filter({ escritorio_id: escritorio.id });
      return todas
        .filter(a => processosIds.includes(a.processo_id))
        .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
    },
    enabled: !!cliente?.id && !!escritorio?.id
  });

  const isLoading = loadingAgendamentos || loadingAudiencias;

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
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Minha Agenda</h1>
            <Button 
              onClick={() => setModalOpen(true)}
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
          ) : (
            <>
              {/* Audiências do processo */}
              {audiencias.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[var(--brand-primary)]" />
                    <h2 className="font-semibold text-[var(--text-primary)]">Audiências</h2>
                    <Badge variant="secondary">{audiencias.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {audiencias.map((audiencia) => (
                      <AudienciaCardCliente key={audiencia.id} audiencia={audiencia} />
                    ))}
                  </div>
                </div>
              )}

              {/* Consultas agendadas */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--brand-primary)]" />
                  <h2 className="font-semibold text-[var(--text-primary)]">Consultas</h2>
                  <Badge variant="secondary">{agendamentos.length}</Badge>
                </div>
                {agendamentos.length === 0 && audiencias.length === 0 ? (
                  <AgendamentosEmptyState onNovoAgendamento={() => setModalOpen(true)} />
                ) : agendamentos.length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)]">Nenhuma consulta agendada.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agendamentos.map((agendamento) => (
                      <AgendamentoCardCliente key={agendamento.id} consulta={agendamento} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <NovoAgendamentoModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refetch();
        }}
        user={user}
        escritorioId={escritorio?.id}
      />
    </div>
  );
}

function AudienciaCardCliente({ audiencia }) {
  const statusColors = {
    agendada: "bg-blue-100 text-blue-800",
    confirmada: "bg-green-100 text-green-800",
    realizada: "bg-gray-100 text-gray-700",
    cancelada: "bg-red-100 text-red-800",
    adiada: "bg-yellow-100 text-yellow-800",
  };
  const tipoLabel = {
    conciliacao: "Conciliação",
    instrucao: "Instrução",
    julgamento: "Julgamento",
    inicial: "Inicial",
    una: "Audiência Una",
    outra: "Audiência",
  };
  return (
    <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl">
      <div className="flex items-start justify-between mb-2">
        <span className="font-medium text-[var(--text-primary)] text-sm">
          {tipoLabel[audiencia.tipo] || "Audiência"}
        </span>
        <Badge className={statusColors[audiencia.status] || statusColors.agendada}>
          {audiencia.status}
        </Badge>
      </div>
      <div className="space-y-1 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(audiencia.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-1">
          <Scale className="w-3 h-3" />
          {new Date(audiencia.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          {audiencia.modalidade && ` · ${audiencia.modalidade}`}
        </div>
        {audiencia.local && (
          <div className="truncate">{audiencia.local}</div>
        )}
      </div>
    </div>
  );
}