import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function RelatorioPDF() {
  const [selectedProcesso, setSelectedProcesso] = useState(null);
  const [exportingId, setExportingId] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['relatorio-processos', user?.email],
    queryFn: async () => {
      if (!user) return [];
      try {
        const clientes = await base44.entities.Cliente.filter({ email: user.email });
        if (clientes.length === 0) return [];
        const clienteIds = clientes.map(c => c.id);
        const allProcessos = await base44.entities.Processo.list();
        return allProcessos.filter(p => clienteIds.includes(p.cliente_id));
      } catch (error) {
        console.error('Erro ao carregar processos:', error);
        return [];
      }
    },
    enabled: !!user
  });

  const handleExportPDF = async (processo) => {
    setExportingId(processo.id);
    try {
      const response = await base44.functions.invoke('exportProcessoPDF', {
        processoId: processo.id,
        numero: processo.numero_cnj,
        titulo: processo.titulo
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `processo-${processo.numero_cnj}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF: ' + error.message);
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
              <p className="text-[var(--text-secondary)]">Faça login para acessar os relatórios</p>
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
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Relatórios & Exportação</h1>
          <p className="text-[var(--text-secondary)]">Exporte seus processos em PDF com todas as informações</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : processos.length === 0 ? (
          <Card className="bg-[var(--bg-elevated)]">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3 opacity-50" />
              <p className="text-[var(--text-secondary)]">Você não possui processos para exportar</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processos.map((processo) => (
              <Card 
                key={processo.id}
                className="bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg text-[var(--text-primary)] truncate">
                        {processo.titulo || 'Sem título'}
                      </CardTitle>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                        CNJ: {processo.numero_cnj}
                      </p>
                    </div>
                    <FileText className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {processo.area && (
                      <p className="text-[var(--text-secondary)]">
                        <span className="font-medium">Área:</span> {processo.area}
                      </p>
                    )}
                    {processo.tribunal && (
                      <p className="text-[var(--text-secondary)]">
                        <span className="font-medium">Tribunal:</span> {processo.tribunal}
                      </p>
                    )}
                    {processo.data_distribuicao && (
                      <p className="text-[var(--text-secondary)]">
                        <span className="font-medium">Distribuição:</span> {new Date(processo.data_distribuicao).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleExportPDF(processo)}
                      disabled={exportingId === processo.id}
                      className="flex-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] gap-2"
                    >
                      {exportingId === processo.id ? (
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}