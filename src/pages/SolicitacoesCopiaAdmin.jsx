import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, CheckCircle, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModuleHeader from '@/components/cliente/ModuleHeader';
import ResumeLoader from '@/components/common/ResumeLoader';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

const statusBadges = {
  pendente_pagamento: 'bg-yellow-100 text-yellow-800',
  pagamento_confirmado: 'bg-blue-100 text-blue-800',
  processando: 'bg-purple-100 text-purple-800',
  entregue: 'bg-green-100 text-green-800',
  expirado: 'bg-gray-100 text-gray-800',
  rejeitado: 'bg-red-100 text-red-800'
};

export default function SolicitacoesCopiaAdmin() {
  const [filter, setFilter] = useState('pendente_pagamento');
  const queryClient = useQueryClient();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: solicitacoes = [], isLoading: loadingSolicitacoes } = useQuery({
    queryKey: ['solicitacoes-copia', filter, user?.role],
    queryFn: async () => {
      if (user?.role !== 'admin') return [];
      if (filter === 'todas') {
        return base44.entities.SolicitacaoCopiaEletronicaCliente.list();
      }
      return base44.entities.SolicitacaoCopiaEletronicaCliente.filter({
        status: filter
      });
    },
    enabled: !!user && user.role === 'admin'
  });

  const gerarPdfMutation = useMutation({
    mutationFn: (solicitacao_id) => 
      base44.functions.invoke('processarSolicitacaoCopiaEletronica', {
        solicitacao_id,
        acao: 'gerar_pdf'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-copia'] });
      toast.success('PDF gerado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  const enviarEmailMutation = useMutation({
    mutationFn: (solicitacao_id) => 
      base44.functions.invoke('processarSolicitacaoCopiaEletronica', {
        solicitacao_id,
        acao: 'enviar_email'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-copia'] });
      toast.success('Email enviado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  if (loadingUser || !user || user.role !== 'admin') {
    return <ResumeLoader />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <ModuleHeader
        title="Solicitações de Cópias Eletrônicas"
        breadcrumbItems={[
          { label: 'Dashboard', url: createPageUrl('Dashboard') },
          { label: 'Cópias Eletrônicas' }
        ]}
        icon={Download}
      />

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['pendente_pagamento', 'pagamento_confirmado', 'processando', 'entregue', 'todas'].map((s) => (
            <Button
              key={s}
              variant={filter === s ? 'default' : 'outline'}
              onClick={() => setFilter(s)}
              className="whitespace-nowrap"
            >
              {s.replace(/_/g, ' ').toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Tabela */}
        {loadingSolicitacoes ? (
          <div className="text-center py-8">Carregando...</div>
        ) : solicitacoes.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            Nenhuma solicitação encontrada
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border-primary)]">
                <tr>
                  <th className="text-left p-3">Email Cliente</th>
                  <th className="text-left p-3">Processo</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Valor</th>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoes.map((sol) => (
                  <tr key={sol.id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]">
                    <td className="p-3 font-medium">{sol.cliente_email}</td>
                    <td className="p-3 text-xs font-mono">{sol.processo_id?.slice(0, 8)}</td>
                    <td className="p-3">
                      <Badge className={statusBadges[sol.status]}>
                        {sol.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">R$ {sol.valor?.toFixed(2)}</td>
                    <td className="p-3 text-xs">
                      {new Date(sol.data_solicitacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-3 space-x-2">
                      {sol.status === 'pagamento_confirmado' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => gerarPdfMutation.mutate(sol.id)}
                            disabled={gerarPdfMutation.isPending}
                          >
                            {gerarPdfMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => enviarEmailMutation.mutate(sol.id)}
                            disabled={enviarEmailMutation.isPending}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {sol.status === 'entregue' && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={sol.pdf_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}