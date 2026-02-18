import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function RelatorioFaturas() {
  const [exportingId, setExportingId] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: honorarios = [], isLoading } = useQuery({
    queryKey: ['relatorio-honorarios', user?.email],
    queryFn: async () => {
      if (!user) return [];
      try {
        const clientes = await base44.entities.Cliente.filter({ email: user.email });
        if (clientes.length === 0) return [];
        const clienteIds = clientes.map(c => c.id);
        const allHonorarios = await base44.entities.Honorario.list();
        return allHonorarios
          .filter(h => clienteIds.includes(h.cliente_id))
          .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      } catch (error) {
        console.error('Erro ao carregar honorários:', error);
        return [];
      }
    },
    enabled: !!user
  });

  const statusColors = {
    pendente: 'bg-red-100 text-red-800',
    parcialmente_pago: 'bg-yellow-100 text-yellow-800',
    pago: 'bg-green-100 text-green-800',
    cancelado: 'bg-gray-100 text-gray-800'
  };

  const handleExportPDF = async (honorario) => {
    setExportingId(honorario.id);
    try {
      const response = await base44.functions.invoke('exportFaturaPDF', {
        honorarioId: honorario.id,
        clienteId: honorario.cliente_id,
        valor: honorario.valor_total
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fatura-${honorario.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Fatura exportada com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar fatura:', error);
      toast.error('Erro ao exportar fatura: ' + error.message);
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
              <p className="text-[var(--text-secondary)]">Faça login para acessar seus relatórios</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalPendente = honorarios
    .filter(h => h.status === 'pendente' || h.status === 'parcialmente_pago')
    .reduce((sum, h) => sum + (h.valor_total || 0), 0);

  const totalPago = honorarios
    .filter(h => h.status === 'pago')
    .reduce((sum, h) => sum + (h.valor_total || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Minhas Faturas</h1>
          <p className="text-[var(--text-secondary)]">Acompanhe seus honorários e exporte relatórios em PDF</p>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[var(--bg-elevated)] border-red-200">
            <CardContent className="p-6">
              <p className="text-sm text-[var(--text-secondary)] mb-1">Pendente</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--bg-elevated)] border-green-200">
            <CardContent className="p-6">
              <p className="text-sm text-[var(--text-secondary)] mb-1">Pago</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : honorarios.length === 0 ? (
          <Card className="bg-[var(--bg-elevated)]">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3 opacity-50" />
              <p className="text-[var(--text-secondary)]">Você não possui faturas</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {honorarios.map((honorario) => (
              <Card 
                key={honorario.id}
                className="bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg text-[var(--text-primary)]">
                        Fatura #{honorario.id?.slice(-6).toUpperCase()}
                      </CardTitle>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {new Date(honorario.created_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <FileText className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-[var(--text-secondary)]">Valor:</span>{' '}
                      <span className="font-bold text-[var(--text-primary)]">
                        R$ {(honorario.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[var(--text-secondary)]">Pago:</span>{' '}
                      <span className="font-bold text-[var(--text-primary)]">
                        R$ {(honorario.valor_pago || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[var(--text-secondary)]">Tipo:</span>{' '}
                      <span className="font-bold text-[var(--text-primary)]">{honorario.tipo || 'Não especificado'}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-[var(--border-primary)]">
                    <Badge className={statusColors[honorario.status] || statusColors.pendente}>
                      {honorario.status || 'pendente'}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handleExportPDF(honorario)}
                    disabled={exportingId === honorario.id}
                    className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] gap-2"
                  >
                    {exportingId === honorario.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Exportando...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Exportar PDF
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}