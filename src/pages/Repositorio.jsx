import React from 'react';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, FileText, Image, Video, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

const repositoryModules = [
  {
    title: 'Modelos de Documentos',
    description: 'Templates e modelos editáveis',
    icon: FileText,
    url: createPageUrl('ModelosDocumentos'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Arquivos do Escritório',
    description: 'Documentos e arquivos gerais',
    icon: HardDrive,
    url: createPageUrl('Repositorio'),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Imagens e Mídia',
    description: 'Fotos, logos e recursos visuais',
    icon: Image,
    url: createPageUrl('Repositorio'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Vídeos',
    description: 'Conteúdo em vídeo e gravações',
    icon: Video,
    url: createPageUrl('Videos'),
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
];

export default function Repositorio() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb items={[
        { label: 'Administração', url: createPageUrl('Administracao') },
        { label: 'Repositório' }
      ]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <FolderOpen className="w-8 h-8" />
          Repositório
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Central de documentos e arquivos do escritório
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {repositoryModules.map((module) => (
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