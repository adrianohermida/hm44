import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Calendar, Mail, Plug, Settings as SettingsIcon, FileText, Clock, Database } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';

export default function Configuracoes() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Publicações',
      description: 'Importar publicações de processos via CSV',
      icon: Upload,
      path: createPageUrl('PublicacoesImport'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Cálculo de Prazos',
      description: 'Geração automática de prazos processuais',
      icon: Clock,
      path: createPageUrl('CalculoPrazos'),
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'DataJud CNJ',
      description: 'Sincronização com API pública do CNJ',
      icon: Database,
      path: createPageUrl('DatajudConfig'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Agenda',
      description: 'Configurar disponibilidade e horários',
      icon: Calendar,
      path: createPageUrl('Settings') + '?tab=calendar',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'E-mail',
      description: 'Preferências de notificações',
      icon: Mail,
      path: createPageUrl('Settings') + '?tab=preferences',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Integrações',
      description: 'Conectar serviços externos',
      icon: Plug,
      path: createPageUrl('Integracoes'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Plataforma',
      description: 'Gerenciar conectores e APIs',
      icon: Database,
      path: createPageUrl('Plataforma'),
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      title: 'Geral',
      description: 'Configurações do sistema',
      icon: SettingsIcon,
      path: createPageUrl('Settings'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: 'Configurações' }]} />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Configurações
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Gerencie preferências e integrações do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.path}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[var(--brand-primary)]"
                onClick={() => navigate(module.path)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${module.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${module.color}`} />
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}