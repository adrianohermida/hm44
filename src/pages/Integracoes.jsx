import React from 'react';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plug, TestTube, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const integrationModules = [
  {
    title: 'Conectores',
    description: 'Gerencie integrações com APIs externas',
    icon: Plug,
    url: createPageUrl('Conectores'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Testes de API',
    description: 'Teste e valide endpoints de conectores',
    icon: TestTube,
    url: createPageUrl('AdminEndpoints'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Monitoramento',
    description: 'Monitore consumo e performance de APIs',
    icon: Activity,
    url: createPageUrl('AnalyticsConsumo'),
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary-100)]',
  },
];

export default function Integracoes() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Plataforma', url: createPageUrl('Plataforma') },
        { label: 'Integrações' }
      ]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Hub de Integrações
        </h1>
        <p className="text-[var(--text-secondary)]">
          Gerencie conectores, testes e monitoramento de APIs externas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrationModules.map((module) => (
          <Link key={module.url} to={module.url}>
            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <module.icon className={`w-6 h-6 ${module.color}`} />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {module.title}
                  <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] transition-colors" />
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}