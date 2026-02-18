import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Info } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ParametroInput from './inputs/ParametroInput';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function EndpointTester({ endpoint, onResult }) {
  const [params, setParams] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const obrigatorios = endpoint.parametros_obrigatorios || [];
  const opcionais = endpoint.parametros_opcionais || [];

  const testar = async () => {
    const newErrors = {};
    obrigatorios.forEach(p => {
      const nome = typeof p === 'string' ? p : p.nome;
      if (!params[nome]) newErrors[nome] = 'Campo obrigatório';
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const { data } = await base44.functions.invoke('testarEndpointAPI', {
        endpoint_id: endpoint.id,
        parametros: params
      });
      
      if (!data) {
        throw new Error('Resposta vazia do servidor');
      }

      // Validar schema se disponível
      if (data.sucesso && endpoint.schema_resposta) {
        try {
          const validacaoRes = await base44.functions.invoke('validarResposta', {
            endpoint_id: endpoint.id,
            resposta: data.resposta
          });
          data.validacao = validacaoRes.data;
        } catch (e) {
          console.error('Erro validação schema:', e);
        }
      }
      
      onResult(data);
      
      // Feedback específico baseado no resultado
      if (data.sucesso) {
        toast.success(`✅ Sucesso em ${data.tempo_ms}ms | Status ${data.http_status}`, {
          duration: 3000
        });
      } else {
        toast.error(`❌ Falha: ${data.resposta?.message || 'Erro desconhecido'} | Status ${data.http_status}`, {
          duration: 5000
        });
      }
    } catch (err) {
      onResult(null);
      toast.error(`❌ Erro na execução: ${err.message || 'Erro desconhecido'}`, {
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ResumeLoader />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-800">
          <strong>Endpoint:</strong> {endpoint.metodo} {endpoint.path}
        </p>
      </div>

      {obrigatorios.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">Parâmetros Obrigatórios</p>
          {obrigatorios.map(p => {
            const param = typeof p === 'string' ? { nome: p, tipo: 'string' } : p;
            return (
              <ParametroInput
                key={param.nome}
                param={{ ...param, obrigatorio: true }}
                value={params[param.nome]}
                onChange={(v) => {
                  setParams({...params, [param.nome]: v});
                  setErrors({...errors, [param.nome]: null});
                }}
                error={errors[param.nome]}
              />
            );
          })}
        </div>
      )}

      {opcionais.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">Parâmetros Opcionais</p>
          {opcionais.map(p => {
            const param = typeof p === 'string' ? { nome: p, tipo: 'string' } : p;
            return (
              <ParametroInput
                key={param.nome}
                param={{ ...param, obrigatorio: false }}
                value={params[param.nome]}
                onChange={(v) => setParams({...params, [param.nome]: v})}
              />
            );
          })}
        </div>
      )}

      <Button onClick={testar} disabled={loading} className="w-full">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
        {loading ? 'Executando...' : 'Executar Teste'}
      </Button>
    </div>
  );
}