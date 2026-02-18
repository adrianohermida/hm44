import React from 'react';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Eye, Lock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const complianceModules = [
  {
    title: 'Auditoria de Acesso',
    description: 'Logs de acessos e navegação',
    icon: Eye,
    url: createPageUrl('AuditoriaNavegacao'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Termos Legais',
    description: 'Gestão de termos e aceites',
    icon: FileText,
    url: createPageUrl('GestaoTermosLegais'),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Aceites Eletrônicos',
    description: 'Controle de aceites de documentos',
    icon: Lock,
    url: createPageUrl('AceitesEletronicos'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Violações',
    description: 'Alertas e violações detectadas',
    icon: AlertTriangle,
    url: createPageUrl('AuditoriaNavegacao'),
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
];

export default function Compliance() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb items={[
        { label: 'Administração', url: createPageUrl('Administracao') },
        { label: 'Compliance' }
      ]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Shield className="w-8 h-8" />
          Compliance & Auditoria
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Conformidade, segurança e auditoria do sistema
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {complianceModules.map((module) => (
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