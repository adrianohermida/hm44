import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Book, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ModuleHeader from '@/components/cliente/ModuleHeader';
import PersistentCTABanner from '@/components/cliente/PersistentCTABanner';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function FlipbookGaleria() {
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: assinante, isLoading: loadingAssinante } = useQuery({
    queryKey: ['assinante-flipbook', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const assinantes = await base44.entities.AssinanteFliBook.filter({
        cliente_email: user.email,
        status: 'ativo'
      });
      return assinantes[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: processos = [], isLoading: loadingProcessos } = useQuery({
    queryKey: ['processos-flipbook', assinante?.id],
    queryFn: async () => {
      if (!assinante?.processos_flipbook?.length) return [];
      // Carregar detalhes dos processos
      return Promise.all(
        assinante.processos_flipbook.map(async (p) => {
          const procs = await base44.entities.Processo.filter({ id: p.processo_id });
          return {
            ...procs[0],
            arquivos: p.arquivo_urls,
            dataAtualizacao: p.data_ultima_atualizacao
          };
        })
      );
    },
    enabled: !!assinante
  });

  if (loadingUser || loadingAssinante) return <ResumeLoader />;

  if (!assinante || assinante.status !== 'ativo') {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <ModuleHeader
          title="FliBOOK - Galeria de Processos"
          icon={Book}
          breadcrumbItems={[
            { label: 'Painel', url: '/meu-painel' },
            { label: 'FliBOOK' }
          ]}
        />
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <Card>
            <CardContent className="p-12 text-center space-y-4">
              <Book className="w-12 h-12 text-[var(--text-secondary)] mx-auto opacity-50" />
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Assinatura FliBOOK não está ativa
              </h2>
              <p className="text-[var(--text-secondary)]">
                Você precisa estar inscrito em um plano FliBOOK para visualizar os processos em flipbook.
              </p>
              <Button className="bg-[var(--brand-primary)]" onClick={() => window.location.href = '/plano-flipbook'}>
                Contratar Plano
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <PersistentCTABanner />
      
      <ModuleHeader
        title="FliBOOK - Galeria de Processos"
        icon={Book}
        breadcrumbItems={[
          { label: 'Painel', url: '/meu-painel' },
          { label: 'FliBOOK' }
        ]}
      />

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Status Badge */}
        <Card className="mb-6 bg-[var(--brand-primary)]/5 border-[var(--brand-primary)]/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">
                ✓ Assinatura Ativa
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Plano: {assinante.plano.replace(/_/g, ' ').toUpperCase()}
              </p>
            </div>
            {assinante.monitoramento_escavador_ativo && (
              <div className="px-3 py-1 bg-[var(--brand-primary)] text-white text-xs font-semibold rounded-full">
                Monitoramento Ativo
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processos Grid */}
        {loadingProcessos ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : processos.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center space-y-4">
              <Book className="w-12 h-12 text-[var(--text-secondary)] mx-auto opacity-50" />
              <h3 className="font-semibold text-[var(--text-primary)]">
                Nenhum processo disponível
              </h3>
              <p className="text-[var(--text-secondary)]">
                Você ainda não tem processos com flipbook disponível.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processos.map((processo) => (
              <Card key={processo.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-sm line-clamp-2">
                    {processo.titulo || processo.numero_cnj}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Thumbnail/Preview Area */}
                  <div className="bg-[var(--bg-secondary)] rounded-lg h-40 flex items-center justify-center">
                    <Book className="w-12 h-12 text-[var(--brand-primary)] opacity-50" />
                  </div>

                  {/* Info */}
                  <div className="text-xs space-y-2 text-[var(--text-secondary)]">
                    <p>CNJ: {processo.numero_cnj?.slice(0, 12)}...</p>
                    {processo.dataAtualizacao && (
                      <p>Atualizado: {new Date(processo.dataAtualizacao).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => window.location.href = `/flipbook-viewer?processo_id=${processo.id}`}
                    className="w-full bg-[var(--brand-primary)]"
                    size="sm"
                  >
                    <Book className="w-4 h-4 mr-2" />
                    Abrir FliBOOK
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