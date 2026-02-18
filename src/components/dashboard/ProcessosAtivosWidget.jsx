import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useErrorReporting } from '@/components/hooks/useErrorReporting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProcessosAtivosWidget() {
  const { wrapQuery } = useErrorReporting();
  
  const { data: user } = useQuery(wrapQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  }, 'PAGE_LOAD', 'usuário'));

  const { data: escritorio } = useQuery(wrapQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user,
  }, 'ENTITIES', 'escritório'));

  const { data: processos = [], isLoading } = useQuery(wrapQuery({
    queryKey: ['processos-ativos', escritorio?.[0]?.id],
    queryFn: () => base44.entities.Processo.filter({ 
      escritorio_id: escritorio[0].id,
      status: 'ativo'
    }),
    enabled: !!escritorio?.length,
  }, 'ENTITIES', 'processos ativos'));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
          Processos Ativos
        </CardTitle>
        <Link 
          to={createPageUrl('Processos')} 
          className="text-sm text-[var(--brand-primary)] hover:underline flex items-center gap-1"
        >
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[var(--text-primary)]">
          {processos.length}
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {processos.length === 1 ? 'processo em andamento' : 'processos em andamento'}
        </p>
      </CardContent>
    </Card>
  );
}