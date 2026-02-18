import React, { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Database } from 'lucide-react';

export default function DatajudAnalytics({ darkMode = false }) {
  const { data: processos = [] } = useQuery({
    queryKey: ['analytics-datajud'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      if (!escritorios[0]) return [];
      return base44.entities.Processo.filter({
        escritorio_id: escritorios[0].id,
        numero_cnj: { $exists: true }
      }, '-updated_date', 500);
    }
  });

  const stats = useMemo(() => {
    const total = processos.length;
    const sincronizados = processos.filter(p => p.sync_status === 'synced').length;
    const taxa = total > 0 ? Math.round((sincronizados / total) * 100) : 0;
    
    const porTribunal = {};
    processos.forEach(p => {
      const tribunal = p.tribunal || 'N/A';
      if (!porTribunal[tribunal]) porTribunal[tribunal] = { total: 0, synced: 0 };
      porTribunal[tribunal].total++;
      if (p.sync_status === 'synced') porTribunal[tribunal].synced++;
    });
    
    return { total, sincronizados, taxa, porTribunal };
  }, [processos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardDescription>Taxa de Sincronização</CardDescription>
          <CardTitle className="text-4xl text-green-600">{stats.taxa}%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {stats.sincronizados} de {stats.total} processos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Tribunais</CardDescription>
          <CardTitle className="text-4xl">{Object.keys(stats.porTribunal).length}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Diferentes tribunais</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Processos Sincronizados</CardDescription>
          <CardTitle className="text-4xl">{stats.sincronizados}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Via DataJud CNJ</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Por Tribunal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(stats.porTribunal).map(([tribunal, data]) => (
              <div key={tribunal} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">{tribunal}</p>
                <p className="text-xs text-gray-600">
                  {data.synced}/{data.total} ({Math.round((data.synced/data.total)*100)}%)
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}