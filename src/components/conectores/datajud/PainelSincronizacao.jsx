import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, Search, Play } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function PainelSincronizacao({ escritorioId }) {
  const [filtro, setFiltro] = useState('');
  const queryClient = useQueryClient();

  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['processos-sync-status', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return base44.entities.Processo.filter({ escritorio_id: escritorioId }, '-updated_date', 500);
    },
    enabled: !!escritorioId,
    staleTime: 30 * 1000
  });

  const syncMutation = useMutation({
    mutationFn: async (processoId) => {
      const response = await base44.functions.invoke('syncProcessoDatajud', { processo_id: processoId });
      return response.data;
    },
    onSuccess: (data, processoId) => {
      queryClient.invalidateQueries(['processos-sync-status']);
      if (data.success) {
        toast.success('Processo sincronizado');
      } else {
        toast.error(data.erro || 'Erro na sincronização');
      }
    }
  });

  const syncAllMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('cronSincronizacaoDatajud');
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['processos-sync-status']);
      toast.success(`${data.sincronizados || 0} processos sincronizados`);
    }
  });

  const processosFiltrados = processos.filter(p => 
    !filtro || 
    p.numero_cnj?.includes(filtro) || 
    p.titulo?.toLowerCase().includes(filtro.toLowerCase())
  );

  const stats = {
    total: processos.length,
    synced: processos.filter(p => p.sync_status === 'synced').length,
    pending: processos.filter(p => p.sync_status === 'pending').length,
    error: processos.filter(p => p.sync_status === 'error').length,
    not_found: processos.filter(p => p.sync_status === 'not_found').length
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'synced': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'not_found': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      synced: { label: 'Sincronizado', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Pendente', className: 'bg-gray-100 text-gray-800' },
      error: { label: 'Erro', className: 'bg-red-100 text-red-800' },
      not_found: { label: 'Não Encontrado', className: 'bg-orange-100 text-orange-800' }
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.synced}</div>
            <div className="text-xs text-gray-600">Sincronizados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
            <div className="text-xs text-gray-600">Erros</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.not_found}</div>
            <div className="text-xs text-gray-600">Não Encontrados</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Input
          placeholder="Filtrar por CNJ ou título..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => syncAllMutation.mutate()}
          disabled={syncAllMutation.isPending}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${syncAllMutation.isPending ? 'animate-spin' : ''}`} />
          Sincronizar Todos
        </Button>
      </div>

      {/* Processos List */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Sincronização ({processosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Carregando...</div>
            ) : processosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filtro ? 'Nenhum processo encontrado' : 'Nenhum processo cadastrado'}
              </div>
            ) : (
              processosFiltrados.map((processo) => (
                <div
                  key={processo.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  {getStatusIcon(processo.sync_status)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{processo.titulo || 'Sem título'}</div>
                    <div className="text-xs text-gray-600 font-mono">{processo.numero_cnj}</div>
                    {processo.ultima_sincronizacao_datajud && (
                      <div className="text-xs text-gray-500">
                        Última sync: {format(new Date(processo.ultima_sincronizacao_datajud), 'dd/MM/yyyy HH:mm')}
                      </div>
                    )}
                  </div>

                  {getStatusBadge(processo.sync_status)}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => syncMutation.mutate(processo.id)}
                    disabled={syncMutation.isPending}
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}