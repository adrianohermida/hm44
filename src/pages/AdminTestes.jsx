import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import TesteStatus from '@/components/conectores/TesteStatus';
import ProvedorSelector from '@/components/provedores/ProvedorSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import MetricasCard from '@/components/conectores/MetricasCard';
import { CheckCircle2, XCircle, Activity, BarChart3 } from 'lucide-react';
import ModuloNav from '@/components/conectores/ModuloNav';
import useURLParams from '@/components/conectores/navigation/URLParamsHandler';
import HistoricoTestes from '@/components/conectores/teste/HistoricoTestes';
import VisualizadorResposta from '@/components/conectores/teste/VisualizadorResposta';
import { createPageUrl } from '@/utils';
import useResponsive from '@/components/hooks/useResponsive';
import LoadingState from '@/components/common/LoadingState';
import { STALE_TIMES } from '@/components/utils/queryConfig';

export default function AdminTestes() {
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const [provedorFiltro, setProvedorFiltro] = useState('all');
  const [statusFiltro, setStatusFiltro] = useState('all');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [testeSelecionado, setTesteSelecionado] = useState(null);
  
  useURLParams('provedor', setProvedorFiltro);
  useURLParams('endpoint', (id) => setProvedorFiltro(id));

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { data: escritorio, isLoading: loadingEscritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const result = await base44.entities.Escritorio.list();
      return result[0] || null;
    },
    enabled: !!user?.email,
    staleTime: STALE_TIMES.STATIC
  });

  const { data: testes = [], isLoading: loadingTestes } = useQuery({
    queryKey: ['testes', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      const list = await base44.entities.TesteEndpoint.filter({ 
        escritorio_id: escritorio.id 
      });
      return list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!escritorio?.id,
    staleTime: STALE_TIMES.DYNAMIC,
    refetchOnWindowFocus: false
  });

  const { data: endpoints = [], isLoading: loadingEndpoints } = useQuery({
    queryKey: ['endpoints', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return await base44.entities.EndpointAPI.filter({ 
        escritorio_id: escritorio.id 
      });
    },
    enabled: !!escritorio?.id,
    staleTime: STALE_TIMES.STATIC,
    refetchOnWindowFocus: false
  });

  const filtrados = testes.filter(t => {
    const endpoint = endpoints.find(e => e.id === t.endpoint_id);
    if (provedorFiltro !== 'all' && endpoint?.provedor_id !== provedorFiltro) return false;
    if (statusFiltro !== 'all' && t.status !== statusFiltro) return false;
    
    if (dataInicio) {
      const inicio = parseISO(dataInicio);
      const testDate = parseISO(t.created_date);
      if (isBefore(testDate, inicio)) return false;
    }
    
    if (dataFim) {
      const fim = parseISO(dataFim);
      const testDate = parseISO(t.created_date);
      if (isAfter(testDate, fim)) return false;
    }
    
    return true;
  });

  if (loadingEscritorio || loadingTestes || loadingEndpoints) {
    return <LoadingState message="Carregando histórico de testes..." />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') },
        { label: 'Histórico' }
      ]} />
      <ModuloNav />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Histórico de Testes
          <span className="ml-2 text-lg sm:text-xl text-[var(--text-secondary)] font-normal">
            ({filtrados.length})
          </span>
        </h1>
        <Button 
          variant="outline"
          onClick={() => navigate(createPageUrl('AnalyticsConsumo'))}
          className="transition-all hover:scale-105"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Ver Analytics</span>
          <span className="sm:hidden">Analytics</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricasCard 
          label="Total de Testes"
          valor={filtrados.length}
          icon={Activity}
        />
        <MetricasCard 
          label="Sucessos"
          valor={filtrados.filter(t => t.status === 'SUCESSO').length}
          icon={CheckCircle2}
        />
        <MetricasCard 
          label="Erros"
          valor={filtrados.filter(t => t.status === 'ERRO').length}
          icon={XCircle}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <ProvedorSelector value={provedorFiltro} onChange={setProvedorFiltro} />
        <Select value={statusFiltro} onValueChange={setStatusFiltro}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="SUCESSO">Sucesso</SelectItem>
            <SelectItem value="ERRO">Erro</SelectItem>
            <SelectItem value="TIMEOUT">Timeout</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          type="date" 
          placeholder="Data início"
          value={dataInicio}
          onChange={e => setDataInicio(e.target.value)}
          className="text-sm"
        />
        <Input 
          type="date" 
          placeholder="Data fim"
          value={dataFim}
          onChange={e => setDataFim(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4">
          {testeSelecionado && (
            <VisualizadorResposta 
              resultado={testeSelecionado}
            />
          )}
          
          <div className="space-y-3 animate-in fade-in duration-300">
            {filtrados.map((t, index) => {
              const endpoint = endpoints.find(e => e.id === t.endpoint_id);
              return (
                <div
                  key={t.id}
                  style={{ animationDelay: `${index * 30}ms` }}
                  className="animate-in slide-in-from-left-4"
                >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    testeSelecionado?.teste?.id === t.id 
                      ? 'ring-2 ring-[var(--brand-primary)] shadow-sm' 
                      : 'hover:bg-[var(--bg-secondary)]'
                  }`}
                  onClick={() => setTesteSelecionado({
                    sucesso: t.sucesso,
                    tempo_ms: t.tempo_ms,
                    http_status: t.http_status,
                    resposta: t.resposta,
                    headers: {},
                    tamanho_bytes: 0,
                    teste: t
                  })}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate">{endpoint?.nome}</p>
                        <p className="text-xs text-[var(--text-tertiary)] truncate">{endpoint?.path}</p>
                        <TesteStatus status={t.status} tempoMs={t.tempo_ms} />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--text-secondary)]">{t.executado_por}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">
                          {format(new Date(t.created_date), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>
              );
            })}
          </div>
        </div>

        {!isMobile && (
          <div className="lg:col-span-1">
            <HistoricoTestes 
              testes={filtrados.slice(0, 10)}
              onSelect={(teste) => setTesteSelecionado({
                sucesso: teste.sucesso,
                tempo_ms: teste.tempo_ms,
                http_status: teste.http_status,
                resposta: teste.resposta,
                headers: {},
                tamanho_bytes: 0,
                teste
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
}