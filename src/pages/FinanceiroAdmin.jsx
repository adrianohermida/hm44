import React from 'react';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, CreditCard, FileText, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

const financeiroModules = [
  {
    title: 'Visão Geral',
    description: 'Dashboard financeiro e métricas',
    icon: TrendingUp,
    url: createPageUrl('Financeiro'),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Honorários',
    description: 'Gestão de honorários e parcelamentos',
    icon: DollarSign,
    url: createPageUrl('PlanosPagamento'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Faturas',
    description: 'Faturas de serviços e APIs',
    icon: Receipt,
    url: createPageUrl('Faturas'),
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Pagamentos',
    description: 'Recebimentos e pagamentos',
    icon: CreditCard,
    url: createPageUrl('Financeiro'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Relatórios',
    description: 'Relatórios e análises financeiras',
    icon: FileText,
    url: createPageUrl('Relatorios'),
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
];

export default function FinanceiroAdmin() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb items={[
        { label: 'Administração', url: createPageUrl('Administracao') },
        { label: 'Financeiro' }
      ]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <DollarSign className="w-8 h-8" />
          Gestão Financeira
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Controle completo das finanças do escritório
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {financeiroModules.map((module) => (
          <Link key={module.url} to={module.url}>
            <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <module.icon className={`w-6 h-6 ${module.color}`} />
                </div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}