import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import moment from 'moment';

export default function DatajudSyncHistory({ darkMode = false }) {
  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['historico-datajud'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      if (!escritorios[0]) return [];
      return base44.entities.Processo.filter({
        escritorio_id: escritorios[0].id,
        ultima_sincronizacao_datajud: { $exists: true }
      }, '-ultima_sincronizacao_datajud', 50);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Histórico de Sincronizações
        </CardTitle>
        <CardDescription>
          Últimas {processos.length} sincronizações realizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : processos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma sincronização realizada</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {processos.map(proc => (
                <div key={proc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{proc.titulo || proc.numero_cnj}</p>
                    <p className="text-xs text-gray-500">
                      {moment(proc.ultima_sincronizacao_datajud).format('DD/MM/YYYY HH:mm')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      proc.sync_status === 'synced' ? 'bg-green-100 text-green-700' :
                      proc.sync_status === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }>
                      {proc.sync_status === 'synced' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {proc.sync_status === 'error' && <XCircle className="w-3 h-3 mr-1" />}
                      {proc.sync_status === 'synced' ? 'Sucesso' :
                       proc.sync_status === 'error' ? 'Erro' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}