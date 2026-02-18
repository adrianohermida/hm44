import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Loader2, X, Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function BuscaTribunalProgressModal({ 
  open, 
  onClose, 
  nome, 
  cpf_cnpj, 
  escritorio_id,
  onComplete 
}) {
  const [mode, setMode] = useState('select'); // 'select', 'processing', 'background'
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [totalProcessos, setTotalProcessos] = useState(0);
  const [processadosCount, setProcessadosCount] = useState(0);
  const [importadosCount, setImportadosCount] = useState(0);
  const [duplicadosCount, setDuplicadosCount] = useState(0);
  const [errosCount, setErrosCount] = useState(0);
  const [currentProcesso, setCurrentProcesso] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const executarBuscaBackground = async () => {
    try {
      setMode('background');
      setStatus('initiating');
      
      console.log('[BuscaTribunalProgressModal] Iniciando busca background:', { nome, cpf_cnpj, escritorio_id });
      
      const response = await base44.functions.invoke('iniciarImportacaoProcessosBackground', {
        nome,
        cpf_cnpj,
        escritorio_id,
        quantidade_processos: 5000
      });

      console.log('[BuscaTribunalProgressModal] Response:', response);

      if (response?.data?.error) {
        throw new Error(response.data.error);
      }

      if (!response?.data?.job_id) {
        throw new Error('Job ID não retornado pela função');
      }

      setJobId(response.data.job_id);
      toast.success('Importação iniciada em segundo plano. Você será notificado quando concluir.');
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('[BuscaTribunalProgressModal] Erro detalhado:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      setStatus('error');
      setErrorMessage(error.response?.data?.error || error.message || 'Erro desconhecido');
      toast.error(`Erro: ${error.response?.data?.error || error.message}`);
    }
  };

  const executarBuscaDireta = async () => {
    try {
      setMode('processing');
      setStatus('searching');
      setProgress(10);
      setCurrentProcesso('Conectando à API Escavador...');

      const response = await base44.functions.invoke('buscarProcessosEnvolvido', {
        nome,
        cpf_cnpj,
        escritorio_id,
        quantidade_processos: 500
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const { found, imported, duplicados } = response.data;
      
      setStatus('importing');
      setProgress(50);
      setTotalProcessos(found);
      setCurrentProcesso(`Processando ${found} processos encontrados...`);
      
      const progressIncrement = 50 / Math.max(found, 1);
      for (let i = 0; i < found; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setProcessadosCount(i + 1);
        setProgress(50 + ((i + 1) * progressIncrement));
      }
      
      setImportadosCount(imported);
      setDuplicadosCount(duplicados || 0);
      setProgress(100);
      setStatus('complete');
      setCurrentProcesso('Concluído!');
      
      toast.success(`${imported} processos importados • ${duplicados} duplicados`);
      
      if (onComplete) {
        onComplete(response.data);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Erro ao buscar processos');
      toast.error('Erro ao buscar processos');
    }
  };

  const handleClose = () => {
    if (status === 'searching' || status === 'importing') {
      if (!confirm('Busca em andamento. Deseja realmente cancelar?')) {
        return;
      }
    }
    onClose();
  };

  useEffect(() => {
    if (open && mode === 'select') {
      // Resetar estado
      setStatus('idle');
      setProgress(0);
      setJobId(null);
    }
  }, [open]);

  const getStatusIcon = () => {
    switch (status) {
      case 'searching':
      case 'importing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'complete':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    if (currentProcesso) return currentProcesso;
    
    switch (status) {
      case 'searching':
        return 'Buscando processos no tribunal...';
      case 'importing':
        return `Importando processos (${processadosCount}/${totalProcessos})...`;
      case 'complete':
        return 'Busca concluída!';
      case 'error':
        return 'Erro na busca';
      default:
        return 'Preparando busca...';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            <span>Buscar Processos no Tribunal</span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'select' && 'Escolha o modo de importação dos processos'}
            {mode === 'background' && 'Importação iniciada em segundo plano'}
            {mode === 'processing' && getStatusText()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {mode === 'select' && (
            <>
              <div className="bg-[var(--bg-secondary)] p-3 rounded-lg text-sm">
                <p className="text-[var(--text-secondary)]">
                  <strong>Buscando por:</strong> {nome}
                  {cpf_cnpj && ` (${cpf_cnpj})`}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-[var(--text-secondary)]">
                  Escolha o modo de importação:
                </p>

                <Button 
                  onClick={executarBuscaDireta}
                  className="w-full justify-start h-auto p-4"
                  variant="outline"
                >
                  <div className="text-left flex-1">
                    <div className="font-medium mb-1">Importação Rápida (até 500 processos)</div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      Resultado imediato • Ideal para volumes médios
                    </div>
                  </div>
                </Button>

                <Button 
                  onClick={executarBuscaBackground}
                  className="w-full justify-start h-auto p-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
                >
                  <Bell className="w-5 h-5 mr-3" />
                  <div className="text-left flex-1">
                    <div className="font-medium mb-1">Importação em Segundo Plano (até 5000)</div>
                    <div className="text-xs opacity-90">
                      Processa em background • Você será notificado quando concluir
                    </div>
                  </div>
                </Button>
              </div>
            </>
          )}

          {mode === 'background' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">Importação Iniciada!</div>
                  <div className="text-sm text-green-700">
                    O processamento está rodando em segundo plano. Você receberá uma notificação quando concluir.
                  </div>
                </div>
              </div>
              {jobId && (
                <div className="text-xs text-[var(--text-tertiary)] text-center">
                  Job ID: {jobId}
                </div>
              )}
            </div>
          )}

          {mode === 'processing' && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{getStatusText()}</span>
                  <span className="text-[var(--text-tertiary)]">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {status === 'complete' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{totalProcessos || 0}</div>
                      <div className="text-xs text-blue-600">Encontrados</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{importadosCount || 0}</div>
                      <div className="text-xs text-green-600">Novos</div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-600">{duplicadosCount || 0}</div>
                      <div className="text-xs text-amber-600">Duplicados</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            {mode === 'select' && (
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
            )}
            {mode === 'background' && (
              <Button onClick={handleClose}>
                Fechar
              </Button>
            )}
            {mode === 'processing' && (
              <>
                {status === 'complete' && (
                  <Button onClick={handleClose}>
                    Fechar
                  </Button>
                )}
                {(status === 'searching' || status === 'importing') && (
                  <Button variant="outline" onClick={handleClose}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                )}
                {status === 'error' && (
                  <>
                    <Button variant="outline" onClick={handleClose}>
                      Fechar
                    </Button>
                    <Button onClick={executarBuscaDireta}>
                      Tentar Novamente
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}