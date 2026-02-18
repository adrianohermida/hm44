import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Clock, Download, Loader2, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function RelatorioPrazos() {
  const [filterType, setFilterType] = useState('vencidos'); // vencidos | proximos
  const [exportingId, setExportingId] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: prazos = [], isLoading } = useQuery({
    queryKey: ['relatorio-prazos', user?.email],
    queryFn: async () => {
      if (!user) return [];
      try {
        const clientes = await base44.entities.Cliente.filter({ email: user.email });
        if (clientes.length === 0) return [];
        const clienteIds = clientes.map(c => c.id);
        
        const processos = await base44.entities.Processo.list();
        const processosIds = processos
          .filter(p => clienteIds.includes(p.cliente_id))
          .map(p => p.id);

        const allPrazos = await base44.entities.Prazo.list();
        return allPrazos
          .filter(p => processosIds.includes(p.processo_id))
          .sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento));
      } catch (error) {
        console.error('Erro ao carregar prazos:', error);
        return [];
      }
    },
    enabled: !!user
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prazosVencidos = prazos.filter(p => {
    const dataVenc = new Date(p.data_vencimento);
    dataVenc.setHours(0, 0, 0, 0);
    return dataVenc < today && p.status !== 'cumprido';
  });

  const prazosProximos = prazos.filter(p => {
    const dataVenc = new Date(p.data_vencimento);
    dataVenc.setHours(0, 0, 0, 0);
    const daysUntil = Math.floor((dataVenc - today) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 7 && p.status !== 'cumprido';
  });

  const filteredPrazos = filterType === 'vencidos' ? prazosVencidos : prazosProximos;

  const statusColors = {
    pendente: 'bg-blue-100 text-blue-800',
    em_andamento: 'bg-yellow-100 text-yellow-800',
    cumprido: 'bg-green-100 text-green-800',
    prorrogado: 'bg-purple-100 text-purple-800',
    perdido: 'bg-red-100 text-red-800'
  };

  const handleExportReport = async () => {
    try {
      const response = await base44.functions.invoke('exportPrazosReport', {
        filterType,
        prazos: filteredPrazos
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-prazos-${filterType}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast.error('Erro ao exportar relatório: ' + error.message);
    } finally {
      setExportingId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[var(--bg-elevated)]">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3 opacity-50" />
              <p className="text-[var(--text-secondary)]">Faça login para acessar relatórios</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Relatório de Prazos</h1>
          <p className="text-[var(--text-secondary)]">Acompanhe prazos vencidos e próximos de vencer</p>
        </div>

        {/* Alertas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Prazos Vencidos</p>
                  <p className="text-2xl font-bold text-red-600">{prazosVencidos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Próximos 7 dias</p>
                  <p className="text-2xl font-bold text-yellow-600">{prazosProximos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <Button
            onClick={() => setFilterType('vencidos')}
            variant={filterType === 'vencidos' ? 'default' : 'outline'}
            className={filterType === 'vencidos' ? 'bg-[var(--brand-primary)]' : ''}
          >
            Vencidos ({prazosVencidos.length})
          </Button>
          <Button
            onClick={() => setFilterType('proximos')}
            variant={filterType === 'proximos' ? 'default' : 'outline'}
            className={filterType === 'proximos' ? 'bg-[var(--brand-primary)]' : ''}
          >
            Próximos 7 dias ({prazosProximos.length})
          </Button>
          <Button
            onClick={handleExportReport}
            disabled={exportingId || filteredPrazos.length === 0}
            className="ml-auto bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] gap-2"
          >
            {exportingId ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Gerar PDF
              </>
            )}
          </Button>
        </div>

        {/* Lista */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredPrazos.length === 0 ? (
          <Card className="bg-[var(--bg-elevated)]">
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3 opacity-50" />
              <p className="text-[var(--text-secondary)]">
                {filterType === 'vencidos' ? 'Nenhum prazo vencido' : 'Nenhum prazo próximo de vencer'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPrazos.map((prazo) => {
              const daysUntil = Math.floor(
                (new Date(prazo.data_vencimento) - today) / (1000 * 60 * 60 * 24)
              );
              return (
                <Card key={prazo.id} className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-[var(--text-primary)]">{prazo.titulo}</h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                          Vencimento: {new Date(prazo.data_vencimento).toLocaleDateString('pt-BR')}
                        </p>
                        {daysUntil < 0 && (
                          <p className="text-sm text-red-600 font-bold mt-1">
                            Vencido há {Math.abs(daysUntil)} dias
                          </p>
                        )}
                      </div>
                      <Badge className={statusColors[prazo.status] || statusColors.pendente}>
                        {prazo.status || 'pendente'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}