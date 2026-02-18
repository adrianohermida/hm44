import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ModuleHeader from '@/components/cliente/ModuleHeader';
import ResumeLoader from '@/components/common/ResumeLoader';
import { toast } from 'sonner';

export default function CheckoutCopia() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const solicitacao_id = searchParams.get('solicitacao_id');

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: solicitacao, isLoading: loadingSolicitacao } = useQuery({
    queryKey: ['solicitacao-copia', solicitacao_id],
    queryFn: async () => {
      if (!solicitacao_id) return null;
      const sols = await base44.entities.SolicitacaoCopiaEletronicaCliente.filter({
        id: solicitacao_id
      });
      return sols[0] || null;
    },
    enabled: !!solicitacao_id
  });

  const handlePayment = async () => {
    if (!solicitacao || !user) {
      toast.error('Dados insuficientes para processar pagamento');
      return;
    }

    setProcessing(true);
    try {
      // Chamar backend para criar Stripe checkout session
      const response = await base44.functions.invoke('criarCheckoutStripeCopia', {
        solicitacao_id: solicitacao.id,
        cliente_email: user.email,
        valor: 39.90
      });

      if (response.data?.checkout_url) {
        // Redirecionar para Stripe checkout
        window.location.href = response.data.checkout_url;
      } else {
        toast.error('Erro ao processar checkout');
      }
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
      setProcessing(false);
    }
  };

  if (loadingUser || loadingSolicitacao) return <ResumeLoader />;

  if (!solicitacao_id || !solicitacao) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <ModuleHeader
          title="Checkout - Cópia Eletrônica"
          icon={CreditCard}
          breadcrumbItems={[
            { label: 'Processos', url: '/processos' },
            { label: 'Checkout' }
          ]}
        />
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Solicitação de cópia não encontrada. Retorne aos processos e tente novamente.
            </AlertDescription>
          </Alert>
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
        title="Checkout - Cópia Eletrônica"
        icon={CreditCard}
        breadcrumbItems={[
          { label: 'Processos', url: '/processos' },
          { label: 'Checkout' }
        ]}
      />

      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between pb-4 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">Cópia Eletrônica do Processo</span>
              <span className="font-semibold">{solicitacao.processo_id?.slice(0, 8)}</span>
            </div>

            <div className="flex justify-between pb-4 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">Email de Entrega</span>
              <span className="font-semibold text-sm">{solicitacao.cliente_email}</span>
            </div>

            <div className="flex justify-between pb-4 border-b border-[var(--border-primary)]">
              <span className="text-[var(--text-secondary)]">Formato</span>
              <span className="font-semibold">PDF com 30 dias de acesso</span>
            </div>

            <div className="flex justify-between pt-4 text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-[var(--brand-primary)]">R$ 39,90</span>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">O que você recebe:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--brand-primary)]" />
                PDF completo com todos os documentos do processo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--brand-primary)]" />
                Acesso por 30 dias a partir da data de entrega
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--brand-primary)]" />
                Suporte por email para dúvidas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--brand-primary)]" />
                Pagamento seguro via Stripe
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Status */}
        {paymentStatus && (
          <Alert className="mb-6">
            <AlertDescription>
              Seu pagamento está sendo processado. Você será redirecionado em breve.
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-[var(--brand-primary)] text-white h-12 text-lg"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar com Stripe - R$ 39,90
            </>
          )}
        </Button>

        {/* Back Button */}
        <Button
          onClick={() => navigate('/processos')}
          variant="outline"
          className="w-full mt-4"
          disabled={processing}
        >
          Cancelar
        </Button>

        {/* Security Note */}
        <p className="text-xs text-[var(--text-secondary)] text-center mt-6">
          💳 Seu pagamento é seguro e processado pelo Stripe. Nós nunca temos acesso aos dados do seu cartão.
        </p>
      </div>
    </div>
  );
}