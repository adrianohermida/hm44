import React from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";

export default function MonitoramentoDatajudToggle({ processo }) {
  const queryClient = useQueryClient();

  const { data: monitoramento, isLoading } = useQuery({
    queryKey: ['monitoramento-datajud', processo?.id],
    queryFn: async () => {
      const result = await base44.entities.MonitoramentoDatajud.filter({
        processo_id: processo.id
      });
      return result[0] || null;
    },
    enabled: !!processo?.id && !!processo?.numero_cnj
  });

  const toggleMutation = useMutation({
    mutationFn: async (ativar) => {
      const result = await base44.functions.invoke('monitorarProcessoDatajud', {
        processo_id: processo.id,
        ativar
      });
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['monitoramento-datajud', processo.id]);
      toast.success(data.ativado ? 'Monitoramento ativado' : 'Monitoramento desativado');
    }
  });

  if (!processo?.numero_cnj) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
      <div className="flex items-center gap-3">
        {monitoramento?.ativo ? (
          <Bell className="w-5 h-5 text-green-600" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-400" />
        )}
        <div>
          <Label className="font-medium">Monitoramento DataJud</Label>
          <p className="text-xs text-gray-600">
            {monitoramento?.ativo ? (
              <>
                Próxima verificação: {moment(monitoramento.proxima_verificacao).format('DD/MM HH:mm')}
              </>
            ) : (
              'Monitoramento desativado'
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {monitoramento?.ativo && (
          <Badge variant="outline" className="text-xs">
            {monitoramento.movimentos_encontrados || 0} movimentos
          </Badge>
        )}
        {isLoading || toggleMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        ) : (
          <Switch
            checked={monitoramento?.ativo || false}
            onCheckedChange={(checked) => toggleMutation.mutate(checked)}
          />
        )}
      </div>
    </div>
  );
}