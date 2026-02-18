import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import Breadcrumb from "@/components/seo/Breadcrumb";

export default function DashboardDividas() {
  const [stats, setStats] = useState({ totalClientes: 0, clientesAtivos: 0, totalDividas: 0, totalPlanos: 0, superendividados: 0 });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
    
    const [clientes, dividas, planos] = await Promise.all([
      base44.entities.Cliente.filter({ escritorio_id: userData.escritorio_id }),
      base44.entities.Divida.filter({ escritorio_id: userData.escritorio_id }),
      base44.entities.PlanoPagamento.filter({ escritorio_id: userData.escritorio_id })
    ]);

    const clientesAtivos = clientes.filter(c => c.status === 'ativo');
    const superendividados = planos.filter(p => p.classificacao_endividamento === 'superendividado');

    setStats({ totalClientes: clientes.length, clientesAtivos: clientesAtivos.length, totalDividas: dividas.length, totalPlanos: planos.length, superendividados: superendividados.length });
    setLoading(false);
  };

  const statCards = [
    { title: "Total de Clientes", value: stats.totalClientes, subtitle: `${stats.clientesAtivos} ativos`, icon: Users, color: "blue" },
    { title: "Dívidas Cadastradas", value: stats.totalDividas, subtitle: "Total no sistema", icon: CreditCard, color: "red" },
    { title: "Planos Criados", value: stats.totalPlanos, subtitle: "Planos de pagamento", icon: TrendingUp, color: "green" },
    { title: "Superendividados", value: stats.superendividados, subtitle: "Requer atenção", icon: AlertTriangle, color: "orange" }
  ];

  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    green: { bg: "bg-[var(--brand-primary-50)]", text: "text-[var(--brand-primary)]", border: "border-[var(--brand-primary-200)]" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb items={[{ label: 'Dashboard Dívidas' }]} />
        <div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Dashboard</h1>
          <p className="text-lg text-[var(--text-secondary)]">Visão geral do sistema de renegociação</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, i) => {
                const Icon = stat.icon;
                const colors = colorMap[stat.color];
                return (
                  <Card key={i} className={`shadow-lg border-2 ${colors.border} hover:shadow-xl transition-all`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">{stat.title}</p>
                          <p className="text-4xl font-bold text-[var(--text-primary)] mb-1">{stat.value}</p>
                          <p className="text-sm text-[var(--text-tertiary)]">{stat.subtitle}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${colors.bg}`}>
                          <Icon className={`w-8 h-8 ${colors.text}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-teal-50">
              <CardHeader><CardTitle className="text-2xl">Bem-vindo ao Sistema de Renegociação</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[var(--text-primary)] text-lg">Sistema completo para diagnóstico e renegociação de dívidas.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {[
                    { title: "Cadastro Completo", desc: "Registre clientes, rendas, despesas e dívidas" },
                    { title: "Diagnóstico Automático", desc: "Análise imediata com classificação" },
                    { title: "Planos Personalizados", desc: "Gere planos com deságio e prazos flexíveis" },
                    { title: "Relatórios em PDF", desc: "Exporte pareceres técnicos completos" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white rounded-lg shadow">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[var(--brand-success)] mt-1" />
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)] mb-1">{item.title}</h3>
                          <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}