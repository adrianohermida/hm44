import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, XCircle, Clock, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

export default function PainelErrosDatajud({ escritorioId }) {
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const { data: erros = [] } = useQuery({
    queryKey: ['erros-datajud', escritorioId, filtroTipo],
    queryFn: async () => {
      const jobs = await base44.entities.CronExecution.filter({
        cron_name: { $in: ['cronSincronizacaoDatajud', 'cronMonitoramentoDatajud'] },
        status: 'error'
      }, '-created_date', 50);

      const healthErrors = await base44.entities.HistoricoSaudeProvedor.filter({
        escritorio_id: escritorioId,
        provedor_id: 'datajud_cnj',
        disponivel: false
      }, '-created_date', 50);

      const testes = await base44.entities.TesteEndpoint.filter({
        escritorio_id: escritorioId,
        provedor_id: 'datajud',
        sucesso: false
      }, '-created_date', 50);

      return [
        ...jobs.map(j => ({ ...j, tipo: 'cron' })),
        ...healthErrors.map(h => ({ ...h, tipo: 'health' })),
        ...testes.map(t => ({ ...t, tipo: 'teste' }))
      ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!escritorioId,
    refetchInterval: 30000
  });

  const errosFiltrados = filtroTipo === 'todos' 
    ? erros 
    : erros.filter(e => e.tipo === filtroTipo);

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'cron': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'health': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'teste': return <XCircle className="w-4 h-4 text-yellow-600" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Painel de Erros DataJud
          </CardTitle>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="cron">Cron Jobs</SelectItem>
              <SelectItem value="health">Saúde</SelectItem>
              <SelectItem value="teste">Testes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          {errosFiltrados.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Nenhum erro registrado
            </p>
          ) : (
            <div className="space-y-3">
              {errosFiltrados.map((erro, idx) => (
                <div key={idx} className="border rounded p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    {getTipoIcon(erro.tipo)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{erro.tipo}</Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(erro.created_date), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm font-medium mt-1">
                        {erro.endpoint_nome || erro.cron_name}
                      </p>
                      <p className="text-xs text-red-700 mt-1 font-mono">
                        {erro.error || erro.erro || 'Erro desconhecido'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}