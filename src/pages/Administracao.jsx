import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { 
  Building2, Users, Settings, DollarSign, FileText, 
  FolderOpen, Shield, ChevronRight 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const adminModules = [
  {
    title: 'Dados do Escritório',
    description: 'Gerencie informações, endereço e dados do escritório',
    icon: Building2,
    url: createPageUrl('Escritorio'),
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary-50)]',
  },
  {
    title: 'Usuários',
    description: 'Gerencie equipe, permissões e acessos',
    icon: Users,
    url: createPageUrl('Usuarios'),
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary-50)]',
  },
  {
    title: 'Configurações',
    description: 'Personalize o sistema e integrações',
    icon: Settings,
    url: createPageUrl('Configuracoes'),
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary-50)]',
  },
  {
    title: 'Financeiro',
    description: 'Controle de receitas, despesas e faturamento',
    icon: DollarSign,
    url: createPageUrl('FinanceiroAdmin'),
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary-50)]',
  },
  {
    title: 'Relatórios',
    description: 'Relatórios gerenciais e análises',
    icon: FileText,
    url: createPageUrl('Relatorios'),
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary-50)]',
  },
  {
    title: 'Repositório',
    description: 'Documentos, modelos e arquivos',
    icon: FolderOpen,
    url: createPageUrl('Repositorio'),
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary-50)]',
  },
  {
    title: 'Compliance',
    description: 'Auditoria, logs e conformidade',
    icon: Shield,
    url: createPageUrl('Compliance'),
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary-50)]',
  },
];

export default function Administracao() {
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Administração' }]} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Administração
        </h1>
        <p className="text-[var(--text-secondary)]">
          Central de gerenciamento e configurações do escritório
        </p>
      </div>

      {escritorio && (
        <Card className="mb-8 bg-gradient-to-r from-[var(--brand-primary-50)] to-white border-[var(--brand-primary-200)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {escritorio.nome}
            </CardTitle>
            <CardDescription>
              {escritorio.cnpj && `CNPJ: ${escritorio.cnpj}`}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((module) => (
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