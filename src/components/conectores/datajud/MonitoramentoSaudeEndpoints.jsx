import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function MonitoramentoSaudeEndpoints({ escritorioId }) {
  const queryClient = useQueryClient();
  const [testando, setTestando] = useState(false);

  const { data: endpoints = [] } = useQuery({
    queryKey: ['endpoints-datajud-ativos', escritorioId],
    queryFn: async () => {
      return await base44.entities.EndpointAPI.filter({
        escritorio_id: escritorioId,
        ativo: true,
        tags: { $contains: 'datajud' }
      });
    },
    enabled: !!escritorioId
  });

  const { data: healthChecks = [] } = useQuery({
    queryKey: ['health-checks-datajud', escritorioId],
    queryFn: async () => {
      return await base44.entities.HistoricoSaudeProvedor.filter({
        escritorio_id: escritorioId,
        provedor_id: 'datajud_cnj'
      }, '-created_date', 50);
    },
    enabled: !!escritorioId,
    refetchInterval: 60000
  });

  const testarSaudeMutation = useMutation({
    mutationFn: async (endpointId) => {
      const endpoint = endpoints.find(e => e.id === endpointId);
      const response = await base44.functions.invoke('testarSaudeEndpointDatajud', {
        endpoint_alias: endpoint.path.replace('/_search', '').replace('/', ''),
        endpoint_id: endpointId
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['health-checks-datajud']);
      toast.success('Teste concluído');
    }
  });

  const testarTodosMutation = useMutation({
    mutationFn: async () => {
      const resultados = [];
      for (const endpoint of endpoints) {
        try {
          const res = await testarSaudeMutation.mutateAsync(endpoint.id);
          resultados.push(res);
        } catch (error) {
          resultados.push({ success: false, erro: error.message });
        }
      }
      return resultados;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['health-checks-datajud']);
      toast.success('Testes completos');
    }
  });

  const getStatusColor = (latencia) => {
    if (latencia < 1000) return 'text-green-600';
    if (latencia < 3000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Monitoramento de Saúde
          </CardTitle>
          <Button
            onClick={() => testarTodosMutation.mutate()}
            disabled={testando || endpoints.length === 0}
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Testar Todos
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {endpoints.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum endpoint ativo</p>
        ) : (
          <div className="space-y-3">
            {endpoints.map((endpoint) => {
              const ultimoCheck = healthChecks.find(h => h.endpoint_nome === endpoint.nome);
              const disponivel = ultimoCheck?.disponivel;
              const latencia = ultimoCheck?.tempo_resposta_ms;

              return (
                <div key={endpoint.id} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {disponivel === true ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : disponivel === false ? (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="font-medium text-sm">{endpoint.nome}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testarSaudeMutation.mutate(endpoint.id)}
                      disabled={testarSaudeMutation.isPending}
                    >
                      Testar
                    </Button>
                  </div>

                  {latencia && (
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className={`w-3 h-3 ${getStatusColor(latencia)}`} />
                      <span className={getStatusColor(latencia)}>{latencia}ms</span>
                    </div>
                  )}

                  {ultimoCheck?.erro && (
                    <p className="text-xs text-red-600 mt-2">{ultimoCheck.erro}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}