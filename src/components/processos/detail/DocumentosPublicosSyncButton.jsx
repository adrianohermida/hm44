import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { limparCNJ } from '@/components/utils/cnjUtils';

export default function DocumentosPublicosSyncButton({ processo, onSyncComplete }) {
  const [loading, setLoading] = useState(false);
  const [statusInfo, setStatusInfo] = useState(null);

  const handleSync = async () => {
    if (!processo?.numero_cnj) {
      toast.error('Número CNJ não disponível');
      return;
    }

    const cnjLimpo = limparCNJ(processo.numero_cnj);
    if (cnjLimpo.length !== 20) {
      toast.error('Número CNJ inválido');
      return;
    }
    
    setLoading(true);
    setStatusInfo(null);
    
    try {
      // 1. Verificar status atual
      const statusRes = await base44.functions.invoke('statusAtualizacaoProcesso', {
        numero_cnj: cnjLimpo
      });

      const status = statusRes.data;

      // 2. Se já tem solicitação em andamento, apenas aguardar
      if (status.ultima_verificacao?.status === 'PENDENTE' || status.ultima_verificacao?.status === 'PROCESSANDO') {
        setStatusInfo({
          tipo: 'pendente',
          mensagem: 'Atualização já em andamento. Aguarde a conclusão.',
          status: status.ultima_verificacao
        });
        toast.info('Atualização em andamento');
        setLoading(false);
        return;
      }

      // 3. Solicitar nova atualização com autos + callback (evita polling)
      const solicitacaoRes = await base44.functions.invoke('solicitarAtualizacaoProcesso', {
        numero_cnj: cnjLimpo,
        autos: 1,
        enviar_callback: 'SIM'
      });

      const solicitacao = solicitacaoRes.data;
      
      setStatusInfo({
        tipo: 'aguardando',
        mensagem: 'Atualização solicitada. Callback será processado automaticamente.',
        solicitacao_id: solicitacao.id
      });

      toast.success('Sincronização iniciada. Você será notificado quando concluir.');
      
      // 4. Polling leve apenas para verificar se callback já foi recebido (máx 5 verificações)
      let tentativas = 0;
      const maxTentativas = 5;
      
      const verificarCallback = async () => {
        tentativas++;
        
        // Verificar se já recebemos o callback
        const callbacks = await base44.entities.CallbackEscavador.filter({
          processo_id: processo.id,
          evento: 'resultado_processo_async',
          processado: true
        });

        if (callbacks.length > 0) {
          const ultimoCallback = callbacks[0];
          
          if (ultimoCallback.created_date > new Date(Date.now() - 5 * 60 * 1000)) {
            // Callback recente (últimos 5 minutos)
            toast.success('Documentos sincronizados via callback');
            if (onSyncComplete) {
              onSyncComplete();
            }
            setLoading(false);
            return;
          }
        }

        // Fallback: verificar status tradicional (reduzido de 30 para 5 tentativas)
        if (tentativas < maxTentativas) {
          const statusCheck = await base44.functions.invoke('statusAtualizacaoProcesso', {
            numero_cnj: cnjLimpo
          });

          const statusAtual = statusCheck.data.ultima_verificacao;

          if (statusAtual?.status === 'SUCESSO') {
            const docsRes = await base44.functions.invoke('listarDocumentosPublicos', {
              numero_cnj: cnjLimpo,
              processo_id: processo.id,
              salvar: true
            });

            toast.success(`${docsRes.data.documentos_salvos} autos sincronizados`);
            if (onSyncComplete) {
              onSyncComplete();
            }
            setLoading(false);
            return;
          }

          setTimeout(verificarCallback, 6000);
        } else {
          // Timeout - aguardar callback
          setStatusInfo({
            tipo: 'info',
            mensagem: 'Processamento em andamento. Recarregue a página em alguns minutos.'
          });
          setLoading(false);
        }
      };

      setTimeout(verificarCallback, 6000);

    } catch (error) {
      console.error('[DocumentosSync] Erro:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Erro ao sincronizar documentos';
      toast.error(errorMsg);
      setLoading(false);
      setStatusInfo({
        tipo: 'erro',
        mensagem: errorMsg
      });
    }
  };

  return (
    <div className="space-y-3 w-full sm:w-auto">
      <Button 
        onClick={handleSync}
        disabled={loading}
        variant="outline"
        size="sm"
        className="gap-2 w-full sm:w-auto"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">{loading ? 'Sincronizando...' : 'Sincronizar'}</span>
        <span className="sm:hidden">{loading ? 'Sync...' : 'Sincronizar'}</span>
      </Button>

      {statusInfo && (
        <Alert className={
          statusInfo.tipo === 'sucesso' ? 'border-green-200 bg-green-50' :
          statusInfo.tipo === 'erro' ? 'border-red-200 bg-red-50' :
          'border-blue-200 bg-blue-50'
        }>
          <div className="flex items-start gap-2">
            {statusInfo.tipo === 'sucesso' && <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />}
            {statusInfo.tipo === 'erro' && <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />}
            {(statusInfo.tipo === 'pendente' || statusInfo.tipo === 'aguardando') && <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />}
            
            <AlertDescription className="text-xs md:text-sm">
              {statusInfo.mensagem}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
}