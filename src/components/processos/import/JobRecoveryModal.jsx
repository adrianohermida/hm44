import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Clock,
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import JobRecoveryActions from './JobRecoveryActions';

export default function JobRecoveryModal({ jobId, open, onClose }) {
  const [reimporting, setReimporting] = useState(false);
  const queryClient = useQueryClient();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job-detail', jobId],
    queryFn: async () => {
      const jobs = await base44.entities.JobImportacao.filter({ id: jobId });
      if (!jobs[0]) throw new Error('Job não encontrado');
      return jobs[0];
    },
    enabled: !!jobId && open,
    retry: false
  });

  const handleReimport = async () => {
    if (!job?.dados || job.dados.length === 0) {
      toast.error('Dados não disponíveis para reimportação');
      return;
    }

    setReimporting(true);
    
    try {
      console.log('[JobRecovery] Reimportando job:', job.id, 'Total:', job.dados.length);
      
      // Criar novo job com mesmos dados e opções
      const novoJob = await base44.entities.JobImportacao.create({
        escritorio_id: job.escritorio_id,
        user_email: job.user_email,
        total_registros: job.dados.length,
        registros_processados: 0,
        registros_sucesso: 0,
        registros_falha: 0,
        status: 'pendente',
        tipo: 'IMPORTACAO_PROCESSOS',
        fonte_origem: job.fonte_origem || 'REIMPORTACAO',
        dados: job.dados,
        opcoes: job.opcoes || {}
      });

      console.log('[JobRecovery] Novo job criado:', novoJob.id);

      // Iniciar processamento
      const response = await base44.functions.invoke('processarJobImportacao', { 
        jobId: novoJob.id 
      });

      console.log('[JobRecovery] Processamento iniciado:', response);
      toast.success('Reimportação iniciada com sucesso');
      queryClient.invalidateQueries(['jobs-queue']);
      onClose();
    } catch (error) {
      console.error('[JobRecovery] Erro ao reimportar:', error);
      toast.error(`Erro ao reimportar: ${error.message}`);
    } finally {
      setReimporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalhes da Importação
          </DialogTitle>
          <DialogDescription>
            Visualize o status e reimporte os dados se necessário
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error || !job ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.message || 'Job não encontrado ou foi removido'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Status Card */}
            <Card className={cn(
              "border-2",
              job.status === 'concluido' ? "border-green-200 bg-green-50" :
              job.status === 'falhou' ? "border-red-200 bg-red-50" :
              "border-blue-200 bg-blue-50"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {job.status === 'concluido' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : job.status === 'falhou' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-600" />
                    )}
                    <div>
                      <p className="font-semibold">
                        Status: {job.status === 'concluido' ? 'Concluído' : 
                                job.status === 'falhou' ? 'Falhou' : 'Processando'}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {new Date(job.created_date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{job.total_registros || 0}</div>
                    <div className="text-sm text-[var(--text-secondary)]">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {job.registros_sucesso || 0}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">Importados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {job.registros_falha || 0}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">Erros</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview dos dados */}
            {job.dados && job.dados.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <p className="font-semibold mb-3">
                    📋 Preview dos Dados ({job.dados.length} registros)
                  </p>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {job.dados.slice(0, 10).map((item, idx) => (
                        <div 
                          key={idx}
                          className="p-2 bg-[var(--bg-secondary)] rounded text-sm"
                        >
                          <span className="font-mono text-xs">
                            {item.numero_cnj || item.numero || `Registro ${idx + 1}`}
                          </span>
                        </div>
                      ))}
                      {job.dados.length > 10 && (
                        <p className="text-xs text-[var(--text-tertiary)] text-center">
                          + {job.dados.length - 10} registros
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Erros */}
            {job.erros && job.erros.length > 0 && (
              <Card className="border-red-200">
                <CardContent className="p-4">
                  <p className="font-semibold text-red-600 mb-3">
                    ⚠️ Erros ({job.erros.length})
                  </p>
                  <ScrollArea className="h-[150px]">
                    <div className="space-y-2">
                      {job.erros.map((err, idx) => (
                        <div key={idx} className="text-sm text-red-700">
                          Linha {err.linha}: {err.erro}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Info do arquivo */}
            {job.opcoes && (
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-sm">Informações do Arquivo</span>
                  </div>
                  <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                    {job.opcoes.nome_arquivo && (
                      <div>📄 Arquivo: <span className="font-mono">{job.opcoes.nome_arquivo}</span></div>
                    )}
                    {job.opcoes.tamanho_bytes && (
                      <div>💾 Tamanho: {(job.opcoes.tamanho_bytes / 1024).toFixed(2)} KB</div>
                    )}
                    {job.opcoes.batchSize && (
                      <div>📦 Batch Size: {job.opcoes.batchSize} registros/lote</div>
                    )}
                    {job.opcoes.duplicateStrategy && (
                      <div>🔄 Duplicatas: {job.opcoes.duplicateStrategy}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ações */}
            <div className="pt-4 border-t space-y-3">
              <JobRecoveryActions
                job={job}
                onReimport={handleReimport}
                reimporting={reimporting}
              />
              
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}