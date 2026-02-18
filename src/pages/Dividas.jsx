import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, TrendingUp, AlertTriangle, CheckCircle, FileText, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const moduleCards = [
  {
    title: 'Clientes',
    description: 'Gerencie clientes em processo de renegociação',
    icon: Users,
    url: createPageUrl('Clientes'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Planos de Pagamento',
    description: 'Gestão de planos e parcelamentos',
    icon: DollarSign,
    url: createPageUrl('PlanosPagamento'),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Gerenciar Dívidas',
    description: 'Gerencie dívidas e credores',
    icon: CreditCard,
    url: createPageUrl('GerenciarDividas'),
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Fontes de Renda',
    description: 'Cadastre fontes de renda',
    icon: TrendingUp,
    url: createPageUrl('FontesRenda'),
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Mínimo Existencial',
    description: 'Configure despesas essenciais',
    icon: FileText,
    url: createPageUrl('MinimoExistencial'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Diagnóstico',
    description: 'Diagnóstico financeiro completo',
    icon: CheckCircle,
    url: createPageUrl('Diagnostico'),
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    title: 'Relatórios',
    description: 'Relatórios e pareceres técnicos',
    icon: FileText,
    url: createPageUrl('RelatorioParecer'),
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export default function DividasPage() {
  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    },
    enabled: !!user
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dividas-stats', escritorio?.id],
    queryFn: async () => {
      const [clientes, dividas, planos] = await Promise.all([
        base44.entities.Cliente.filter({ escritorio_id: escritorio.id }),
        base44.entities.Divida.filter({ escritorio_id: escritorio.id }),
        base44.entities.PlanoPagamento.filter({ escritorio_id: escritorio.id })
      ]);

      const clientesAtivos = clientes.filter(c => c.status === 'ativo');
      const superendividados = planos.filter(p => p.classificacao_endividamento === 'superendividado');

      return {
        totalClientes: clientes.length,
        clientesAtivos: clientesAtivos.length,
        totalDividas: dividas.length,
        totalPlanos: planos.length,
        superendividados: superendividados.length
      };
    },
    enabled: !!escritorio,
    initialData: { totalClientes: 0, clientesAtivos: 0, totalDividas: 0, totalPlanos: 0, superendividados: 0 }
  });

  const statCards = [
    { title: 'Total de Clientes', value: stats.totalClientes, subtitle: `${stats.clientesAtivos} ativos`, icon: Users, color: 'blue' },
    { title: 'Dívidas Cadastradas', value: stats.totalDividas, subtitle: 'Total no sistema', icon: CreditCard, color: 'red' },
    { title: 'Planos Criados', value: stats.totalPlanos, subtitle: 'Planos de pagamento', icon: TrendingUp, color: 'green' },
    { title: 'Superendividados', value: stats.superendividados, subtitle: 'Requer atenção', icon: AlertTriangle, color: 'orange' }
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    green: { bg: 'bg-[var(--brand-primary-50)]', text: 'text-[var(--brand-primary)]', border: 'border-[var(--brand-primary-200)]' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Superendividamento' }]} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Renegociação de Dívidas
        </h1>
        <p className="text-[var(--text-secondary)]">
          Sistema completo para diagnóstico e renegociação de dívidas
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              const colors = colorMap[stat.color];
              return (
                <Card key={stat.title} className={`border-2 ${colors.border} hover:shadow-lg transition-all`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">{stat.title}</p>
                        <p className="text-3xl font-bold text-[var(--text-primary)] mb-1">{stat.value}</p>
                        <p className="text-sm text-[var(--text-tertiary)]">{stat.subtitle}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${colors.bg}`}>
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-teal-50 border-0">
            <CardHeader>
              <CardTitle className="text-xl">Recursos do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Cadastro Completo', desc: 'Registre clientes, rendas, despesas e dívidas' },
                  { title: 'Diagnóstico Automático', desc: 'Análise imediata com classificação' },
                  { title: 'Planos Personalizados', desc: 'Gere planos com deságio e prazos flexíveis' },
                  { title: 'Relatórios em PDF', desc: 'Exporte pareceres técnicos completos' }
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-white rounded-lg shadow">
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moduleCards.map((module) => (
              <Link key={module.url} to={module.url}>
                <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <module.icon className={`w-6 h-6 ${module.color}`} />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <p className="text-sm text-[var(--text-secondary)]">{module.description}</p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}