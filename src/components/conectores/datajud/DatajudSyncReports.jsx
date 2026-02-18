import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function DatajudSyncReports() {
  const { data: processos = [] } = useQuery({
    queryKey: ['processos-datajud-stats'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      if (!escritorios[0]) return [];
      return base44.entities.Processo.filter({
        escritorio_id: escritorios[0].id
      });
    }
  });

  const stats = {
    total: processos.length,
    sincronizados: processos.filter(p => p.sync_status === 'synced').length,
    taxaSucesso: processos.length > 0 
      ? Math.round((processos.filter(p => p.sync_status === 'synced').length / processos.length) * 100) 
      : 0,
    ultimaSincronizacao: processos.find(p => p.ultima_sincronizacao_datajud)?.ultima_sincronizacao_datajud
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.total}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Sincronizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{stats.sincronizados}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Taxa Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">{stats.taxaSucesso}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Última Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-600">
            {stats.ultimaSincronizacao ? new Date(stats.ultimaSincronizacao).toLocaleString('pt-BR') : 'N/A'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}