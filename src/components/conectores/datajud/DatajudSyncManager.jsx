import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Database, RefreshCw, CheckCircle, XCircle, Loader2, Play, Bell } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";

export default function DatajudSyncManager({ darkMode = false }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState(null);
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['processos-datajud'],
    queryFn: () =>
      base44.entities.Processo.filter({
        escritorio_id: escritorio.id,
        numero_cnj: { $exists: true, $ne: '' }
      }, '-updated_date', 100),
    enabled: !!escritorio
  });

  const stats = {
    total: processos.length,
    sincronizados: processos.filter(p => p.sync_status === 'synced').length,
    pendentes: processos.filter(p => !p.sync_status || p.sync_status === 'pending' || p.sync_status === 'not_found').length,
    erros: processos.filter(p => p.sync_status === 'error').length
  };

  const sincronizarMutation = useMutation({
    mutationFn: async (processoId) => {
      const result = await base44.functions.invoke('syncProcessoDatajud', {
        processo_id: processoId
      });
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['processos-datajud']);
      toast.success('Processo sincronizado!');
    },
    onError: (err) => {
      toast.error(err.message || 'Erro na sincronização');
    }
  });

  const toggleMonitoramentoMutation = useMutation({
    mutationFn: async ({ processoId, ativar }) => {
      const result = await base44.functions.invoke('monitorarProcessoDatajud', {
        processo_id: processoId,
        ativar
      });
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['monitoramentos-datajud']);
      toast.success(data.ativado ? 'Monitoramento ativado' : 'Monitoramento desativado');
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sincronizados</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.sincronizados}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pendentes</CardDescription>
            <CardTitle className="text-3xl text-amber-600">{stats.pendentes}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Sincronização DataJud
          </CardTitle>
          <CardDescription>
            Sincronize processos com a API pública do CNJ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={async () => {
              if (stats.pendentes === 0) {
                toast.info('Nenhum processo pendente');
                return;
              }
              setIsSyncing(true);
              for (const proc of processos.filter(p => !p.sync_status || p.sync_status === 'pending')) {
                try {
                  await sincronizarMutation.mutateAsync(proc.id);
                } catch (error) {
                  console.error('Erro:', error);
                }
              }
              setIsSyncing(false);
            }}
            disabled={isSyncing || stats.pendentes === 0 || isLoading}
            className="w-full"
          >
            {isSyncing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sincronizando...</>
            ) : (
              <><Play className="w-4 h-4 mr-2" />Sincronizar {stats.pendentes} Processos</>
            )}
          </Button>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : processos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum processo com CNJ encontrado</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {processos.slice(0, 50).map(proc => (
                  <div key={proc.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{proc.titulo || proc.numero_cnj}</p>
                        <p className="text-xs text-gray-500">{proc.numero_cnj}</p>
                      </div>
                      <Badge className={
                        proc.sync_status === 'synced' ? 'bg-green-100 text-green-700' :
                        proc.sync_status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {proc.sync_status === 'synced' ? 'Sincronizado' :
                         proc.sync_status === 'error' ? 'Erro' : 'Pendente'}
                      </Badge>
                    </div>
                    
                    {proc.sync_status === 'synced' && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Label className="text-xs text-gray-600">Monitorar atualizações</Label>
                        <Switch
                          checked={selectedProcesso === proc.id}
                          onCheckedChange={(checked) => {
                            setSelectedProcesso(checked ? proc.id : null);
                            toggleMonitoramentoMutation.mutate({
                              processoId: proc.id,
                              ativar: checked
                            });
                          }}
                          disabled={toggleMonitoramentoMutation.isPending}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}