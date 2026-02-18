import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import TestParametersInput from './TestParametersInput';
import CopyAPICallButton from './CopyAPICallButton';
import LogTesteDetalhado from './LogTesteDetalhado';

export default function EndpointTesterPanel({ endpoint, provedor, params: externalParams, onParamsChange, onResultsObtained }) {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(externalParams || {});
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    if (externalParams && Object.keys(externalParams).length > 0) {
      setParams(externalParams);
    }
  }, [externalParams]);

  const runTest = async () => {
    // Validar parâmetros obrigatórios
    const parametrosObrigatorios = (endpoint.parametros || []).filter(p => p.obrigatorio);
    const faltantes = parametrosObrigatorios.filter(p => {
      const valor = params[p.nome];
      return valor === null || valor === undefined || valor === '';
    });

    if (faltantes.length > 0) {
      const nomesFaltantes = faltantes.map(p => p.nome).join(', ');
      toast.error(`❌ Parâmetros obrigatórios faltando: ${nomesFaltantes}`);
      return;
    }

    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('testarEndpointAPI', {
        endpoint_id: endpoint.id,
        parametros: params
      });
      
      if (!data) {
        throw new Error('Resposta vazia da API');
      }
      
      setLastResult(data);
      onResultsObtained(data);
      
      // Verificar quota (se aplicável)
      if (data.quota_warning) {
        toast.warning(data.quota_warning);
      } else if (data.quota_blocked) {
        toast.error('🚫 Limite de quota atingido!');
      } else if (data.sucesso) {
        toast.success(`✅ Teste OK: ${data.http_status} (${data.tempo_ms}ms)`);
      } else {
        toast.error(`❌ ${data.erro || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error('❌ Erro no teste:', err);
      
      // Error handling específico
      let errorMessage = 'Erro desconhecido';
      
      if (err.response?.status === 401) {
        errorMessage = 'Não autenticado. Verifique as credenciais.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Sem permissão para acessar este recurso';
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint não encontrado';
      } else if (err.response?.status === 429) {
        errorMessage = 'Limite de requisições excedido';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Erro no servidor externo';
      } else {
        errorMessage = err.response?.data?.erro || err.message;
      }
      
      const errorData = {
        sucesso: false,
        erro: errorMessage,
        http_status: err.response?.status || 500,
        tempo_ms: 0,
        contexto: err.response?.data?.contexto || {
          erro_detalhado: err.stack || err.message,
          metodo: endpoint.metodo,
          path: endpoint.path
        }
      };
      
      onResultsObtained(errorData);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleParamsChange = (newParams) => {
    setParams(newParams);
    onParamsChange?.(newParams);
  };

  // Validar se todos os parâmetros obrigatórios estão preenchidos
  const parametrosObrigatorios = (endpoint.parametros || []).filter(p => p.obrigatorio);
  const temParamsFaltando = parametrosObrigatorios.some(p => {
    const valor = params[p.nome];
    return valor === null || valor === undefined || valor === '';
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyAPICallButton 
          endpoint={endpoint}
          provedor={provedor}
          params={params}
        />
      </div>
      <TestParametersInput 
        endpoint={endpoint}
        value={params}
        onChange={handleParamsChange}
      />
      <Button 
        onClick={runTest} 
        disabled={loading || temParamsFaltando} 
        className="w-full transition-all hover:scale-105 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] disabled:hover:scale-100"
      >
        <Play className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Executando...' : temParamsFaltando ? 'Preencha parâmetros obrigatórios' : 'Executar Teste'}
      </Button>
      
      {lastResult && <LogTesteDetalhado resultado={lastResult} />}
    </div>
  );
}