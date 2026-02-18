import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw, History, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import DockerEndpointsList from './DockerEndpointsList';
import DockerStatusBadge from './DockerStatusBadge';
import JobDetailPanel from './JobDetailPanel';
import PendenciasPanel from './PendenciasPanel';
import RecomendacoesPanel from './RecomendacoesPanel';
import DockerAnaliseActions from './DockerAnaliseActions';
import DockerProgressBar from './DockerProgressBar';
import JobHistoryModal from './JobHistoryModal';
import EndpointExportModal from './EndpointExportModal';
import EndpointsPriorizadosPanel from './EndpointsPriorizadosPanel';
import CriarProvedorButton from './CriarProvedorButton';
import ImportarEndpointsButton from './ImportarEndpointsButton';

export default function DockerAnaliseDetail({ analise, onUpdate }) {
  const [showHistory, setShowHistory] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const { data: job } = useQuery({
    queryKey: ['job', analise.job_id],
    queryFn: async () => {
      if (!analise.job_id) return null;
      const jobs = await base44.entities.JobAnaliseDocker.filter({ id: analise.job_id });
      return jobs[0];
    },
    enabled: !!analise.job_id && analise.status === 'PROCESSANDO',
    refetchInterval: analise.status === 'PROCESSANDO' ? 10000 : false,
    staleTime: 5000
  });

  useEffect(() => {
    if (analise.status === 'PROCESSANDO') {
      const interval = setInterval(onUpdate, 12000);
      return () => clearInterval(interval);
    }
  }, [analise.status, onUpdate]);

  const iniciarAnalise = async () => {
    try {
      await base44.functions.invoke('analisarDocumentosAPI', {
        analise_id: analise.id
      });
      toast.success('Análise iniciada em background');
      onUpdate();
    } catch (err) {
      toast.error('Erro ao iniciar análise');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{analise.titulo}</CardTitle>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {analise.tipo_fonte}
                {analise.tentativas > 0 && ` • Tentativa #${analise.tentativas}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DockerStatusBadge status={analise.status} />
              {analise.status === 'PENDENTE' && (
                <Button onClick={iniciarAnalise} size="sm">
                  <Play className="w-4 h-4 mr-1" />Analisar
                </Button>
              )}
              {analise.status === 'ERRO' && (
                <Button onClick={iniciarAnalise} size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-1" />Reprocessar
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setShowHistory(true)}>
                <History className="w-4 h-4 mr-1" />
                Histórico
              </Button>
              {analise.endpoints_extraidos?.length > 0 && (
                <>
                  <Button size="sm" variant="outline" onClick={() => setShowExport(true)}>
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                  <CriarProvedorButton analise={analise} />
                  <ImportarEndpointsButton analise={analise} />
                </>
              )}
              <DockerAnaliseActions analise={analise} onAction={onUpdate} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DockerProgressBar 
            progresso={analise.progresso_percentual || 0} 
            status={analise.status} 
          />
          {analise.erro_mensagem && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {analise.erro_mensagem}
            </div>
          )}
        </CardContent>
      </Card>

      {job && <JobDetailPanel job={job} />}

      {analise.status === 'CONCLUIDO' && (
        <>
          {analise.endpoints_extraidos?.length > 0 && (
            <EndpointsPriorizadosPanel 
              endpoints={analise.endpoints_extraidos}
              onTestarEndpoint={(endpoint) => {
                toast.info(`Teste de ${endpoint.nome} será implementado em breve`);
              }}
            />
          )}
          <PendenciasPanel pendencias={analise.pendencias} />
          <RecomendacoesPanel recomendacoes={analise.recomendacoes_schema} />
          {analise.endpoints_extraidos?.length > 0 && (
            <DockerEndpointsList 
              endpoints={analise.endpoints_extraidos}
              analiseId={analise.id}
              onUpdate={onUpdate}
            />
          )}
        </>
      )}

      <JobHistoryModal 
        analiseId={analise.id}
        open={showHistory}
        onClose={() => setShowHistory(false)}
      />
      <EndpointExportModal
        endpoints={analise.endpoints_extraidos || []}
        open={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}