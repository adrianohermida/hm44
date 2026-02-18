import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Calendar, MessageSquare, FileText, DollarSign } from "lucide-react";
import { toast } from "sonner";
import ResumeLoader from "@/components/common/ResumeLoader";
import SingleHandNav from "@/components/mobile/SingleHandNav";
import ProcessoCardCliente from "@/components/cliente/ProcessoCardCliente";
import TicketCardCliente from "@/components/cliente/TicketCardCliente";
import AgendamentoCardCliente from "@/components/cliente/AgendamentoCardCliente";
import FaturaCardCliente from "@/components/cliente/FaturaCardCliente";

export default function MeuPainel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => base44.auth.me(),
  });

  const { data: processos = [] } = useQuery({
    queryKey: ["meu-painel-processos", user?.email],
    queryFn: () =>
      base44.entities.Processo.filter(
        { created_by: user?.email },
        "-updated_date",
        10
      ),
    enabled: !!user?.email,
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ["meu-painel-tickets", user?.email],
    queryFn: () =>
      base44.entities.Ticket.filter(
        { created_by: user?.email },
        "-created_date",
        10
      ),
    enabled: !!user?.email,
  });

  const { data: agendamentos = [] } = useQuery({
    queryKey: ["meu-painel-agendamentos", user?.email],
    queryFn: () =>
      base44.entities.Appointment?.filter?.(
        { created_by: user?.email },
        "-created_date",
        10
      ) || [],
    enabled: !!user?.email,
  });

  const { data: faturas = [] } = useQuery({
    queryKey: ["meu-painel-faturas", user?.email],
    queryFn: () =>
      base44.entities.Fatura?.filter?.({ created_by: user?.email }, "-created_date", 5) || [],
    enabled: !!user?.email,
  });

  if (loadingUser) return <ResumeLoader />;
  if (!user) return navigate(createPageUrl("Home"));

  const navItems = [
    { id: "overview", label: "Visão Geral", icon: FileText },
    { id: "processos", label: "Processos", icon: FileText },
    { id: "tickets", label: "Tickets", icon: MessageSquare },
    { id: "agendamentos", label: "Consultas", icon: Calendar },
    { id: "faturas", label: "Faturas", icon: DollarSign },
    { id: "documentos", label: "Documentos", icon: FileText },
    { id: "plano", label: "Plano", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Bem-vindo, {user.full_name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Seu painel de acompanhamento jurídico
          </p>
        </div>
      </div>

      {/* Mobile Tab Nav */}
      <div className="md:hidden border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto">
          <SingleHandNav
            items={navItems}
            activeId={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === item.id
                  ? "border-[var(--brand-primary)] text-[var(--brand-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-[var(--brand-primary)]">
                    {processos.length}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Processos Ativos
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-[var(--brand-primary)]">
                    {tickets.length}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Tickets em Aberto
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-[var(--brand-primary)]">
                    {agendamentos.length}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Consultas Agendadas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-[var(--brand-primary)]">
                    {faturas.length}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Faturas Pendentes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => setActiveTab("processos")}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs">Meus Processos</span>
              </Button>
              <Button
                onClick={() => setActiveTab("tickets")}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">Tickets</span>
              </Button>
              <Button
                onClick={() => setActiveTab("agendamentos")}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Agendar</span>
              </Button>
              <Button
                onClick={() => setActiveTab("faturas")}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                <span className="text-xs">Faturas</span>
              </Button>
            </div>
          </div>
        )}

        {/* Processos Tab */}
        {activeTab === "processos" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Meus Processos</h2>
              <Button onClick={() => navigate(createPageUrl("MeusProcessos"))}>
                <Plus className="w-4 h-4 mr-2" />
                Ver Todos
              </Button>
            </div>
            {processos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-[var(--text-secondary)]">
                    Nenhum processo encontrado
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {processos.slice(0, 3).map((processo) => (
                  <ProcessoCardCliente key={processo.id} processo={processo} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Meus Tickets</h2>
              <Button onClick={() => navigate(createPageUrl("MeusTickets"))}>
                <Plus className="w-4 h-4 mr-2" />
                Ver Todos
              </Button>
            </div>
            {tickets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-[var(--text-secondary)]">
                    Nenhum ticket em aberto
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {tickets.slice(0, 3).map((ticket) => (
                  <TicketCardCliente key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Agendamentos Tab */}
        {activeTab === "agendamentos" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Minhas Consultas</h2>
              <Button onClick={() => navigate(createPageUrl("MinhasConsultas"))}>
                <Plus className="w-4 h-4 mr-2" />
                Ver Todos
              </Button>
            </div>
            {agendamentos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-[var(--text-secondary)]">
                    Nenhuma consulta agendada
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {agendamentos.slice(0, 3).map((agendamento) => (
                  <AgendamentoCardCliente key={agendamento.id} agendamento={agendamento} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Faturas Tab */}
        {activeTab === "faturas" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Minhas Faturas</h2>
              <Button onClick={() => navigate(createPageUrl("MinhasFaturas"))}>
                <Plus className="w-4 h-4 mr-2" />
                Ver Todas
              </Button>
            </div>
            {faturas.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-[var(--text-secondary)]">
                    Nenhuma fatura pendente
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {faturas.map((fatura) => (
                  <FaturaCardCliente key={fatura.id} fatura={fatura} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Documentos Tab */}
        {activeTab === "documentos" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Meus Documentos</h2>
              <Button onClick={() => navigate(createPageUrl("MeusDocumentos"))}>
                <Plus className="w-4 h-4 mr-2" />
                Ver Todos
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-[var(--text-secondary)]">
                  Nenhum documento anexado
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(createPageUrl("MeusDocumentos"))}
                  className="mt-4"
                >
                  Gerenciar Documentos
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plano de Pagamento Tab */}
        {activeTab === "plano" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Plano de Pagamento</h2>
              <Button onClick={() => navigate(createPageUrl("MeuPlanoPagamento"))}>
                <Plus className="w-4 h-4 mr-2" />
                Ver Detalhes
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-[var(--text-secondary)] mb-4">
                  Visualize seu plano de pagamento e parcelas
                </p>
                <Button 
                  onClick={() => navigate(createPageUrl("MeuPlanoPagamento"))}
                  className="bg-[var(--brand-primary)]"
                >
                  Acessar Plano
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}