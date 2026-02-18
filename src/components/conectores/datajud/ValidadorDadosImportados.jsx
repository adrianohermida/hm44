import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, XCircle, Play, FileSearch } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ValidadorDadosImportados({ escritorioId }) {
  const [validando, setValidando] = useState(false);
  const [resultados, setResultados] = useState(null);

  const validarMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('validarDadosImportados', {
        escritorio_id: escritorioId
      });
      return response.data;
    },
    onSuccess: (data) => {
      setResultados(data);
      const totalErros = Object.values(data.validacoes).reduce((sum, v) => sum + v.erros.length, 0);
      if (totalErros === 0) {
        toast.success('✅ Nenhuma inconsistência encontrada');
      } else {
        toast.warning(`⚠️ ${totalErros} inconsistências encontradas`);
      }
    },
    onError: () => {
      toast.error('Erro ao validar dados');
    }
  });

  const handleValidar = () => {
    setValidando(true);
    validarMutation.mutate();
    setTimeout(() => setValidando(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="w-5 h-5" />
            Validador de Dados Importados
          </CardTitle>
          <Button onClick={handleValidar} disabled={validando} size="sm">
            <Play className="w-4 h-4 mr-2" />
            Executar Validação
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {validando && (
          <div className="space-y-2">
            <Progress value={33} className="w-full" />
            <p className="text-xs text-gray-500">Validando dados importados...</p>
          </div>
        )}

        {resultados && (
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {Object.entries(resultados.validacoes).map(([entidade, validacao]) => (
                <div key={entidade} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{entidade}</h3>
                    <Badge variant={validacao.erros.length === 0 ? 'default' : 'destructive'}>
                      {validacao.total} registros | {validacao.erros.length} erros
                    </Badge>
                  </div>

                  {validacao.erros.length === 0 ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <p className="text-sm">Nenhuma inconsistência detectada</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {validacao.erros.slice(0, 5).map((erro, idx) => (
                        <div key={idx} className="bg-red-50 border border-red-200 rounded p-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-900">{erro.tipo}</p>
                              <p className="text-xs text-red-700">{erro.mensagem}</p>
                              {erro.registro_id && (
                                <p className="text-xs text-gray-600 mt-1">ID: {erro.registro_id}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {validacao.erros.length > 5 && (
                        <p className="text-xs text-gray-500">
                          +{validacao.erros.length - 5} erros adicionais
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {!validando && !resultados && (
          <p className="text-sm text-gray-500 text-center py-8">
            Execute a validação para identificar inconsistências nos dados importados
          </p>
        )}
      </CardContent>
    </Card>
  );
}