import React, { useState, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, List, Grid } from 'lucide-react';
import ProvedorCard from '@/components/provedores/ProvedorCard';
import ProvedorListItem from '@/components/conectores/bulk/ProvedorListItem';
import ModuloNav from '@/components/conectores/ModuloNav';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import useProvedorOperations from '@/components/provedores/hooks/useProvedorOperations';
import { toast } from 'sonner';
import ImportarProvedorCSVButton from '@/components/provedores/ImportarProvedorCSVButton';
import SearchInput from '@/components/common/SearchInput';
import ProvedorCardSkeleton from '@/components/conectores/skeletons/ProvedorCardSkeleton';
import FormModalSkeleton from '@/components/conectores/skeletons/FormModalSkeleton';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import useDebouncedSearch from '@/components/hooks/useDebouncedSearch';
import { useEscritorio } from '@/components/hooks/useEscritorio';
import { useCronInvalidation } from '@/components/hooks/useCronInvalidation';
import { STALE_TIMES } from '@/components/utils/queryConfig';

// Lazy load modais pesados
const ProvedorFormModal = lazy(() => import('@/components/provedores/ProvedorFormModal'));
const ProvedorDetailModal = lazy(() => import('@/components/conectores/ProvedorDetailModal'));
const MergeProvedorModal = lazy(() => import('@/components/conectores/bulk/MergeProvedorModal'));

// Lazy load componentes de tabs pesados
const SecretsManager = lazy(() => import('@/components/secrets/SecretsManager'));
const OptimizedProvedoresAnalytics = lazy(() => import('@/components/analytics/OptimizedProvedoresAnalytics'));
const AlertConfigManager = lazy(() => import('@/components/alertas/AlertConfigManager'));

// Lazy load bulk actions
const ProvedorBulkSelector = lazy(() => import('@/components/conectores/bulk/ProvedorBulkSelector'));
const ProvedorBulkActions = lazy(() => import('@/components/conectores/bulk/ProvedorBulkActions'));

export default function AdminProvedores() {
  const [viewingProvedor, setViewingProvedor] = useState(null);
  const { showForm, editing, openForm, closeForm } = useProvedorOperations();
  const [viewMode, setViewMode] = useState('cards');
  const [selected, setSelected] = useState([]);
  const [merging, setMerging] = useState(null);
  const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebouncedSearch('');
  
  useCronInvalidation();

  const { data: escritorio } = useEscritorio();

  const { data: provedores = [], isLoading } = useQuery({
    queryKey: ['provedores', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return await base44.entities.ProvedorAPI.filter({ escritorio_id: escritorio.id });
    },
    enabled: !!escritorio?.id,
    staleTime: STALE_TIMES.STATIC
  });

  const provedoresFiltrados = provedores.filter(p => {
    if (!debouncedSearchTerm) return true;
    const term = debouncedSearchTerm.toLowerCase();
    return (
      p.nome?.toLowerCase().includes(term) ||
      p.descricao?.toLowerCase().includes(term) ||
      p.tipo?.toLowerCase().includes(term)
    );
  });

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-7xl mx-auto">
        <Breadcrumb items={[
        { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') },
        { label: 'Provedores' }
      ]} />
      <ModuloNav />
      
      <Tabs defaultValue="provedores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="provedores">Provedores</TabsTrigger>
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="provedores" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Provedores API 
              <span className="ml-2 text-lg sm:text-xl text-[var(--text-secondary)] font-normal">
                ({provedoresFiltrados.length})
              </span>
            </h1>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
                className="transition-all hover:scale-105"
              >
                {viewMode === 'cards' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
              <ImportarProvedorCSVButton />
              <Button 
                onClick={() => openForm()}
                className="transition-all hover:scale-105 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Novo Provedor</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar provedores..."
            />
          </div>
      {isLoading ? (
        <div className="grid gap-3 sm:gap-4">
          {[...Array(3)].map((_, i) => (
            <ProvedorCardSkeleton key={i} />
          ))}
        </div>
      ) : provedoresFiltrados.length === 0 ? (
        <EmptyState 
          title={searchTerm ? "Nenhum resultado encontrado" : "Nenhum provedor cadastrado"}
          description={searchTerm ? "Tente ajustar os termos de busca" : "Adicione seu primeiro provedor de API"}
          action={!searchTerm && <Button onClick={() => openForm()}><Plus className="w-4 h-4 mr-2" />Novo Provedor</Button>}
        />
      ) : (
        <>
          {viewMode === 'list' && (
            <Suspense fallback={<div className="h-16 bg-[var(--bg-tertiary)] rounded animate-pulse" />}>
              <ProvedorBulkSelector 
                provedores={provedoresFiltrados}
                selected={selected}
                onToggleAll={() => setSelected(selected.length === provedoresFiltrados.length ? [] : provedoresFiltrados.map(p => p.id))}
              />
              <ProvedorBulkActions 
                selectedIds={selected}
                onClear={() => setSelected([])}
                onMerge={(ids) => setMerging(provedoresFiltrados.filter(p => ids.includes(p.id)))}
                onSearchEndpoints={(ids) => toast.info('Buscar endpoints não implementado')}
              />
            </Suspense>
          )}

          {viewMode === 'cards' ? (
            <div className="grid gap-3 sm:gap-4 animate-in fade-in duration-300">
              {provedoresFiltrados.map((p, index) => (
                <div 
                  key={p.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-in slide-in-from-bottom-4"
                >
                  <ProvedorCard 
                    provedor={p}
                    onEdit={openForm}
                    onViewDetails={setViewingProvedor}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {provedoresFiltrados.map(p => (
                <ProvedorListItem 
                  key={p.id} 
                  provedor={p}
                  selected={selected.includes(p.id)}
                  onToggle={(id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])}
                  onEdit={openForm}
                  onView={setViewingProvedor}
                />
              ))}
            </div>
          )}
        </>
      )}
      {showForm && (
        <Suspense fallback={<FormModalSkeleton />}>
          <ProvedorFormModal 
            provedor={editing}
            onClose={closeForm}
          />
        </Suspense>
      )}

      {viewingProvedor && (
        <Suspense fallback={<FormModalSkeleton />}>
          <ProvedorDetailModal 
            provedor={viewingProvedor}
            onClose={() => setViewingProvedor(null)}
            onEdit={(provedor) => {
              setViewingProvedor(null);
              openForm(provedor);
            }}
          />
        </Suspense>
      )}

      {merging && (
        <Suspense fallback={<FormModalSkeleton />}>
          <MergeProvedorModal 
            provedores={merging}
            onClose={() => setMerging(null)}
          />
        </Suspense>
      )}
        </TabsContent>

        <TabsContent value="secrets">
          <Suspense fallback={<LoadingState message="Carregando secrets..." />}>
            <SecretsManager provedores={provedores} />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics">
          <Suspense fallback={<div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[var(--bg-tertiary)] rounded animate-pulse" />)}</div><div className="h-64 bg-[var(--bg-tertiary)] rounded animate-pulse" /></div>}>
            <OptimizedProvedoresAnalytics provedores={provedores} isLoading={isLoading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="alertas">
          <Suspense fallback={<LoadingState message="Carregando alertas..." />}>
            <AlertConfigManager provedores={provedores} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
    </ErrorBoundary>
  );
}