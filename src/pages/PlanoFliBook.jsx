import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Book, CreditCard, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ModuleHeader from '@/components/cliente/ModuleHeader';
import ResumeLoader from '@/components/common/ResumeLoader';
import { toast } from 'sonner';

export default function PlanoFliBook() {
  const [selectedPlan, setSelectedPlan] = useState('anual_avista');
  const queryClient = useQueryClient();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: assinante } = useQuery({
    queryKey: ['assinante-flipbook', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const assinantes = await base44.entities.AssinanteFliBook.filter({
        cliente_email: user.email
      });
      return assinantes[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio-flipbook'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const criarAssinaturaMutation = useMutation({
    mutationFn: async (plano) => {
      if (!user || !escritorio) {
        throw new Error('Dados insuficientes');
      }

      const valor = plano === 'anual_avista' ? 297.0 : 29.90;

      const novaAssinatura = await base44.entities.AssinanteFliBook.create({
        cliente_email: user.email,
        escritorio_id: escritorio.id,
        plano: plano,
        valor_total: valor,
        status: 'ativo',
        data_inicio_assinatura: new Date().toISOString(),
        data_proxima_renovacao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        monitoramento_escavador_ativo: true,
        processos_flipbook: []
      });

      // Redirecionar para checkout
      window.location.href = `/checkout-flipbook?assinante_id=${novaAssinatura.id}`;
      return novaAssinatura;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinante-flipbook'] });
      toast.success('Redirecionando para pagamento...');
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  if (loadingUser) return <ResumeLoader />;

  const plans = [
    {
      id: 'anual_avista',
      name: 'Anual à Vista',
      price: 297.0,
      monthlyEq: 24.75,
      billing: 'Pago uma única vez',
      features: [
        'Acesso a todos os flipbooks',
        'Monitoramento de processos',
        '30GB de armazenamento',
        'Suporte prioritário',
        'Atualizações automáticas'
      ]
    },
    {
      id: 'anual_parcelado_12x',
      name: 'Anual em 12x',
      price: 29.90,
      monthlyEq: 29.90,
      billing: '12 parcelas de R$ 29,90',
      features: [
        'Acesso a todos os flipbooks',
        'Monitoramento de processos',
        '30GB de armazenamento',
        'Suporte prioritário',
        'Atualizações automáticas'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <ModuleHeader
        title="FliBOOK - Visualizador de Processos"
        icon={Book}
        breadcrumbItems={[
          { label: 'Painel', url: '/meu-painel' },
          { label: 'Plano FliBOOK' }
        ]}
      />

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Current Status */}
        {assinante && assinante.status === 'ativo' && (
          <Card className="mb-8 border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[var(--brand-primary)]" />
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    Você tem uma assinatura ativa
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Plano: {assinante.plano.replace(/_/g, ' ').toUpperCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? 'border-[var(--brand-primary)] border-2 ring-2 ring-[var(--brand-primary)]/10'
                  : 'hover:border-[var(--brand-primary)]/50'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {plan.billing}
                    </p>
                  </div>
                  {plan.id === 'anual_avista' && (
                    <Badge className="bg-[var(--brand-primary)] text-white">
                      Mais Economico
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <div className="text-4xl font-bold text-[var(--brand-primary)]">
                    R$ {plan.price.toFixed(2)}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    ≈ R$ {plan.monthlyEq.toFixed(2)}/mês
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {assinante?.plano === plan.id && assinante?.status === 'ativo' ? (
                  <Button disabled className="w-full" variant="outline">
                    ✓ Seu Plano Atual
                  </Button>
                ) : (
                  <Button
                    onClick={() => criarAssinaturaMutation.mutate(plan.id)}
                    disabled={criarAssinaturaMutation.isPending}
                    className="w-full bg-[var(--brand-primary)]"
                  >
                    {criarAssinaturaMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Contratar {plan.name}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>O que você ganha com o FliBOOK</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                  📖 Visualizador Avançado
                </h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Navegue pelos processos em formato flipbook com zoom e busca integrada
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                  🔍 Monitoramento Escavador
                </h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Acompanhe alterações em tempo real com upgrade de monitoramento
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                  💾 Armazenamento 30GB
                </h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Guarde todos os seus processos em nuvem de forma segura
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                  🚀 Sem Limitações
                </h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Acesso ilimitado a todos os processos do seu escritório
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}