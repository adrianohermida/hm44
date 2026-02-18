import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Play, Loader2 } from 'lucide-react';
import ParametroInput from '../inputs/ParametroInput';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import useResponsive from '@/components/hooks/useResponsive';

export default function TesteFormUnificado({ endpoint, provedor, onResultado }) {
  const { isMobile } = useResponsive();
  const [parametros, setParametros] = useState({});
  const [errosValidacao, setErrosValidacao] = useState({});
  const [loading, setLoading] = useState(false);

  const obrigatorios = endpoint?.parametros_obrigatorios || [];
  const opcionais = endpoint?.parametros_opcionais || [];

  const validar = () => {
    const erros = {};
    obrigatorios.forEach(param => {
      if (!parametros[param]) {
        erros[param] = 'Campo obrigatório';
      }
    });
    return erros;
  };

  const executar = async () => {
    const erros = validar();
    if (Object.keys(erros).length > 0) {
      setErrosValidacao(erros);
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setErrosValidacao({});

    try {
      const response = await base44.functions.invoke('testarEndpointAPI', {
        endpoint_id: endpoint.id,
        parametros
      });

      if (response.data.sucesso) {
        toast.success(`Teste executado com sucesso em ${response.data.tempo_ms}ms`, {
          description: `Status: ${response.data.http_status}`
        });
      } else {
        toast.error('Teste falhou', {
          description: response.data.teste?.erro_mensagem || 'Erro desconhecido'
        });
      }

      onResultado(response.data);
    } catch (error) {
      toast.error('Erro ao executar teste', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-base sm:text-lg">Testar {endpoint?.nome}</span>
          <span className="text-xs sm:text-sm font-normal text-[var(--text-secondary)]">
            {provedor?.nome} • {endpoint?.metodo}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {obrigatorios.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Parâmetros Obrigatórios *
            </h3>
            {obrigatorios.map(param => (
              <ParametroInput
                key={param}
                nome={param}
                valor={parametros[param] || ''}
                onChange={(valor) => setParametros(prev => ({ ...prev, [param]: valor }))}
                erro={errosValidacao[param]}
                obrigatorio
              />
            ))}
          </div>
        )}

        {opcionais.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
              Parâmetros Opcionais
            </h3>
            {opcionais.map(param => (
              <ParametroInput
                key={param}
                nome={param}
                valor={parametros[param] || ''}
                onChange={(valor) => setParametros(prev => ({ ...prev, [param]: valor }))}
              />
            ))}
          </div>
        )}

        <Button 
          onClick={executar} 
          disabled={loading}
          className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-700)] min-h-[44px]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isMobile ? 'Testando...' : 'Executando...'}
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {isMobile ? 'Testar' : 'Executar Teste'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}