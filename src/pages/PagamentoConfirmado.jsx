import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModuleHeader from '@/components/cliente/ModuleHeader';
import ResumeLoader from '@/components/common/ResumeLoader';
import { toast } from 'sonner';

export default function PagamentoConfirmado() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const solicitacao_id = searchParams.get('solicitacao_id');

  const { data: solicitacao, isLoading } = useQuery({
    queryKey: ['solicitacao-confirmada', solicitacao_id],
    queryFn: async () => {
      if (!solicitacao_id) return null;
      const sols = await base44.entities.SolicitacaoCopiaEletronicaCliente.filter({
        id: solicitacao_id
      });
      return sols[0] || null;
    },
    enabled: !!solicitacao_id
  });

  if (isLoading) return <ResumeLoader />;

  if (!solicitacao) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <ModuleHeader
          title="Pagamento"
          icon={CheckCircle}
          breadcrumbItems={[
            { label: 'Processos', url: '/processos' },
            { label: 'Confirmação' }
          ]}
        />
        <div className="max-w-2xl mx-auto p-4 md:p-6 text-center">
          <p className="text-[var(--text-secondary)]">Dados não encontrados</p>
          <Button onClick={() => navigate('/processos')} className="mt-4">
            Voltar aos Processos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <ModuleHeader
        title="Pagamento Confirmado!"
        icon={CheckCircle}
        breadcrumbItems={[
          { label: 'Processos', url: '/processos' },
          { label: 'Confirmação' }
        ]}
      />

      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Success Card */}
        <Card className="border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5 mb-6">
          <CardContent className="p-12 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-[var(--brand-primary)] mx-auto" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Pagamento Realizado com Sucesso!
            </h2>
            <p className="text-[var(--text-secondary)]">
              Sua solicitação foi confirmada. Em breve você receberá o PDF por email.
            </p>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between pb-3 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">ID da Solicitação</span>
              <span className="font-mono text-sm font-semibold">{solicitacao.id}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">Processo</span>
              <span className="font-semibold">{solicitacao.processo_id?.slice(0, 8)}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">Email de Entrega</span>
              <span className="font-semibold text-sm">{solicitacao.cliente_email}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {solicitacao.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex justify-between pt-4">
              <span className="font-bold">Valor Pago</span>
              <span className="font-bold text-[var(--brand-primary)] text-lg">
                R$ {solicitacao.valor?.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-[var(--brand-primary)]">1.</span>
                <span>O administrador receberá sua solicitação</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--brand-primary)]">2.</span>
                <span>O PDF será gerado e enviado por email em até 24 horas</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--brand-primary)]">3.</span>
                <span>Você terá 30 dias para fazer download do arquivo</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate('/processos')}
            className="flex-1 bg-[var(--brand-primary)]"
          >
            Voltar aos Processos
          </Button>
          <Button
            onClick={() => navigate('/meu-painel')}
            variant="outline"
            className="flex-1"
          >
            Ir para Painel
          </Button>
        </div>

        {/* Support */}
        <p className="text-xs text-[var(--text-secondary)] text-center mt-8">
          Dúvidas? Entre em contato com o suporte por email ou chat.
        </p>
      </div>
    </div>
  );
}