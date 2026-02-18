import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, CheckCircle2, XCircle, RefreshCw, History } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { toast } from 'sonner';
import { useEscritorio } from '@/components/hooks/useEscritorio';

export default function PlatformaCron() {
  const [executando, setExecutando] = useState(null);
  const queryClient = useQueryClient();
  const { data: escritorio } = useEscritorio();
  const escritorioId = escritorio?.id;

  const { data: historico = [], isLoading } = useQuery({
    queryKey: ['historico-saude', escritorioId],
    queryFn: () => base44.entities.HistoricoSaudeProvedor.filter(
      { escritorio_id: escritorioId },
      '-created_date',
      100
    ),
    enabled: !!escritorioId,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 30000
  });

  const { data: execucoes = [] } = useQuery({
    queryKey: ['cron-execucoes', escritorioId],
    queryFn: () => base44.entities.CronExecution.filter(
      { escritorio_id: escritorioId },
      '-created_date',
      50
    ),
    enabled: !!escritorioId,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 30000
  });

  const executarCronMutation = useMutation({
    mutationFn: async (cronId) => {
      const functionName = cronId === 'cronRotacaoAutomatica' ? 'cronRotacaoAutomatica' : 'cronTestesSaudeProvedores';
      const response = await base44.functions.invoke(functionName, {});
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['historico-saude']);
      queryClient.invalidateQueries(['provedores']);
      queryClient.invalidateQueries(['cron-execucoes']);
      
      if (data?.invalidate_cache) {
        window.dispatchEvent(new CustomEvent('cron-completed', {
          detail: { invalidate_cache: data.invalidate_cache }
        }));
      }
      
      toast.success('✅ Cron executado');
      setExecutando(null);
    },
    onError: (error) => {
      toast.error('Erro ao executar cron: ' + error.message);
      setExecutando(null);
    }
  });

  const handleExecutar = (cronId) => {
    setExecutando(cronId);
    executarCronMutation.mutate(cronId);
  };

  const cronJobs = [
    {
      id: 'cronTestesSaudeProvedores',
      nome: 'Teste de Saúde de Provedores',
      descricao: 'Testa saúde e latência de todos os provedores ativos',
      frequencia: 'A cada 1 hora',
      ultimaExecucao: execucoes.find(e => e.cron_name === 'cronTestesSaudeProvedores')?.inicio,
      status: execucoes.find(e => e.cron_name === 'cronTestesSaudeProvedores')?.status || 'Desconhecido'
    },
    {
      id: 'cronRotacaoAutomatica',
      nome: 'Rotação Automática de Secrets',
      descricao: 'Executa rotações agendadas de secrets',
      frequencia: 'A cada 6 horas',
      ultimaExecucao: execucoes.find(e => e.cron_name === 'cronRotacaoAutomatica')?.inicio,
      status: execucoes.find(e => e.cron_name === 'cronRotacaoAutomatica')?.status || 'Desconhecido'
    }
  ];

  const historicoAgrupado = historico.reduce((acc, h) => {
    const data = new Date(h.created_date);
    const chave = format(data, 'yyyy-MM-dd HH:00', { locale: ptBR });
    if (!acc[chave]) acc[chave] = [];
    acc[chave].push(h);
    return acc;
  }, {});

  if (isLoading) return <LoadingState message="Carregando histórico..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Plataforma', url: createPageUrl('Plataforma') },
        { label: 'Cron Jobs' }
      ]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Cron Jobs & Automações</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Gerencie tarefas agendadas e automações da plataforma
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        {cronJobs.map(job => (
          <Card key={job.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-[var(--brand-primary)]" />
                    <h3 className="font-semibold text-[var(--text-primary)]">{job.nome}</h3>
                    <Badge variant={
                      job.status === 'Saudável' ? 'default' :
                      job.status === 'Degradado' ? 'secondary' :
                      'destructive'
                    }>
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">{job.descricao}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">{job.frequencia}</span>
                    </div>
                    {job.ultimaExecucao && (
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span className="text-[var(--text-secondary)]">
                          Última: {format(new Date(job.ultimaExecucao), "dd/MM 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleExecutar(job.id)}
                  disabled={executando === job.id}
                >
                  {executando === job.id ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Executar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Execuções do Cron</CardTitle>
        </CardHeader>
        <CardContent>
          {execucoes.length === 0 ? (
            <EmptyState
              title="Nenhuma execução registrada"
              description="Execute o cron manualmente ou aguarde a próxima execução automática"
            />
          ) : (
            <div className="space-y-3">
              {execucoes.map(exec => (
                <div key={exec.id} className="border rounded-lg p-4 bg-[var(--bg-secondary)]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {exec.status === 'sucesso' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : exec.status === 'erro' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                        )}
                        <span className="font-medium text-sm">
                          {format(new Date(exec.inicio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <Badge variant={
                          exec.status === 'sucesso' ? 'default' :
                          exec.status === 'erro' ? 'destructive' :
                          'secondary'
                        }>
                          {exec.status}
                        </Badge>
                      </div>
                      {exec.duracao_ms && (
                        <span className="text-xs text-[var(--text-secondary)]">
                          Duração: {(exec.duracao_ms / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                    <div className="text-right text-xs space-y-1">
                      {exec.provedores_testados > 0 && (
                        <div className="text-[var(--text-secondary)]">
                          {exec.provedores_testados} testados
                        </div>
                      )}
                      {exec.provedores_saudaveis > 0 && (
                        <div className="text-green-600">
                          {exec.provedores_saudaveis} saudáveis
                        </div>
                      )}
                      {exec.provedores_com_erro > 0 && (
                        <div className="text-red-600">
                          {exec.provedores_com_erro} com erro
                        </div>
                      )}
                    </div>
                  </div>
                  {exec.erro_mensagem && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {exec.erro_mensagem}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}