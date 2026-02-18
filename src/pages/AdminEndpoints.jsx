import React, { useState, lazy, Suspense, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Plus, List, Grid } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EndpointCard from '@/components/conectores/EndpointCard';
import EndpointListItem from '@/components/conectores/bulk/EndpointListItem';
import ProvedorSelector from '@/components/provedores/ProvedorSelector';
import ModuloNav from '@/components/conectores/ModuloNav';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import SearchInput from '@/components/common/SearchInput';
import useURLParams from '@/components/conectores/navigation/URLParamsHandler';
import useEndpointOperations from '@/components/conectores/hooks/useEndpointOperations';
import useEndpointFilters from '@/components/conectores/hooks/useEndpointFilters';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import useResponsive from '@/components/hooks/useResponsive';
import useDebouncedSearch from '@/components/hooks/useDebouncedSearch';
import EndpointCardSkeleton from '@/components/conectores/skeletons/EndpointCardSkeleton';
import FormModalSkeleton from '@/components/conectores/skeletons/FormModalSkeleton';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { STALE_TIMES } from '@/components/utils/queryConfig';

// Lazy load modais pesados
const EndpointFormModal = lazy(() => import('@/components/conectores/EndpointFormModal'));
const EndpointDetailModal = lazy(() => import('@/components/conectores/EndpointDetailModal'));
const MergeEndpointsModal = lazy(() => import('@/components/conectores/bulk/MergeEndpointsModal'));

// Lazy load componentes de importação/detecção
const ImportCSVButton = lazy(() => import('@/components/conectores/import/ImportCSVButton'));
const DuplicateDetector = lazy(() => import('@/components/conectores/bulk/DuplicateDetector'));
const DuplicatesList = lazy(() => import('@/components/conectores/bulk/DuplicatesList'));

// Lazy load bulk actions
const EndpointBulkSelector = lazy(() => import('@/components/conectores/bulk/EndpointBulkSelector'));
const EndpointBulkActions = lazy(() => import('@/components/conectores/bulk/EndpointBulkActions'));

export default function AdminEndpoints() {
  const { isMobile } = useResponsive();
  const queryClient = useQueryClient();
  const [viewingEndpoint, setViewingEndpoint] = useState(null);
  const { showForm, editing, openForm, closeForm } = useEndpointOperations();
  const [viewMode, setViewMode] = useState('cards');
  const [selected, setSelected] = useState([]);
  const [mergingEndpoints, setMergingEndpoints] = useState(null);
  const [showDuplicates, setShowDuplicates] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: provedores = [] } = useQuery({
    queryKey: ['provedores', user?.email],
    queryFn: async () => {
      if (user?.role === 'admin' && user?.email === 'adrianohermida@gmail.com') {
        return await base44.entities.ProvedorAPI.list();
      }
      const escritorios = await base44.entities.Escritorio.filter({ created_by: user.email });
      if (escritorios.length > 0) {
        return await base44.entities.ProvedorAPI.filter({ escritorio_id: escritorios[0].id });
      }
      return [];
    },
    enabled: !!user,
    staleTime: STALE_TIMES.STATIC
  });

  const { data: endpoints = [], isLoading } = useQuery({
    queryKey: ['endpoints', user?.email],
    queryFn: async () => {
      return await base44.entities.EndpointAPI.list();
    },
    enabled: !!user,
    staleTime: STALE_TIMES.STATIC
  });

  const viewingProvedor = provedores.find(p => p.id === viewingEndpoint?.provedor_id);

  const [mostrarOrfaos, setMostrarOrfaos] = useState(false);
  const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebouncedSearch('');
  const { provedorFiltro, versaoFiltro, setProvedorFiltro, setVersaoFiltro, filtrados } = useEndpointFilters(endpoints);
  
  const endpointsOrfaos = endpoints.filter(e => !e.provedor_id);
  
  const endpointsFiltrados = useMemo(() => {
    const base = mostrarOrfaos ? endpointsOrfaos : (provedorFiltro === 'all' ? endpoints : filtrados);
    
    if (!debouncedSearchTerm) return base;
    
    const term = debouncedSearchTerm.toLowerCase();
    return base.filter(e => {
      const searchText = `${e.nome || ''} ${e.path || ''} ${e.descricao || ''} ${e.metodo || ''}`.toLowerCase();
      return searchText.includes(term);
    });
  }, [mostrarOrfaos, endpointsOrfaos, provedorFiltro, endpoints, filtrados, debouncedSearchTerm]);
  
  useURLParams('provedor', setProvedorFiltro);
  useURLParams('endpoint', (id) => {
    const ep = endpoints.find(e => e.id === id);
    if (ep) openForm(ep);
  });

  return (
    <ErrorBoundary>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') },
        { label: 'Endpoints' }
      ]} />
      <ModuloNav />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Endpoints API
            <span className="ml-2 text-lg sm:text-xl text-[var(--text-secondary)] font-normal">
              ({endpointsFiltrados.length})
            </span>
          </h1>
          {mostrarOrfaos && (
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Exibindo {endpointsOrfaos.length} endpoints órfãos (sem provedor)
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {!isMobile && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
              className="transition-all hover:scale-105"
            >
              {viewMode === 'cards' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
          )}
          <Suspense fallback={<div className="w-24 h-9 bg-[var(--bg-tertiary)] rounded animate-pulse" />}>
            <ImportCSVButton onSuccess={() => queryClient.invalidateQueries(['endpoints'])} />
          </Suspense>
          <Button 
            onClick={() => openForm()}
            className="transition-all hover:scale-105 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Novo Endpoint</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
        <SearchInput 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar endpoints..."
        />
        <Button 
          variant={mostrarOrfaos ? 'default' : 'outline'}
          onClick={() => setMostrarOrfaos(!mostrarOrfaos)}
        >
          Órfãos ({endpointsOrfaos.length})
        </Button>
        <Button 
          variant={showDuplicates ? 'default' : 'outline'}
          onClick={() => setShowDuplicates(!showDuplicates)}
        >
          Duplicados
        </Button>
        {!mostrarOrfaos && (
          <ProvedorSelector value={provedorFiltro} onChange={setProvedorFiltro} />
        )}
        <Select value={versaoFiltro} onValueChange={setVersaoFiltro}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Versão" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas versões</SelectItem>
            <SelectItem value="V1">V1</SelectItem>
            <SelectItem value="V2">V2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isLoading && (
        <Suspense fallback={null}>
          <DuplicateDetector endpoints={endpoints} />
        </Suspense>
      )}

      {showDuplicates && !isLoading && (
        <Suspense fallback={<LoadingState message="Carregando duplicados..." />}>
          <DuplicatesList 
            endpoints={endpoints} 
            onMerge={setMergingEndpoints}
          />
        </Suspense>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <EndpointCardSkeleton key={i} />
          ))}
        </div>
      ) : endpointsFiltrados.length === 0 ? (
        <EmptyState 
          title={mostrarOrfaos ? "Nenhum endpoint órfão" : "Nenhum endpoint encontrado"}
          description={mostrarOrfaos ? "Todos endpoints têm provedor associado" : "Comece criando seu primeiro endpoint ou ajuste os filtros"}
        />
      ) : (
        <>
          {viewMode === 'list' && (
            <Suspense fallback={<div className="h-16 bg-[var(--bg-tertiary)] rounded animate-pulse" />}>
              <EndpointBulkSelector 
                endpoints={endpointsFiltrados}
                selected={selected}
                onToggleAll={() => setSelected(selected.length === endpointsFiltrados.length ? [] : endpointsFiltrados.map(e => e.id))}
              />
              <EndpointBulkActions 
                selectedIds={selected}
                provedores={provedores}
                onClear={() => setSelected([])}
              />
            </Suspense>
          )}

          {(viewMode === 'cards' || isMobile) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-in fade-in duration-300">
              {endpointsFiltrados.map((e, index) => (
                <div 
                  key={e.id}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className="animate-in slide-in-from-bottom-3"
                >
                  <EndpointCard
                    endpoint={e}
                    onEdit={openForm}
                    onViewDetails={setViewingEndpoint}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {endpointsFiltrados.map(e => (
                <EndpointListItem
                  key={e.id}
                  endpoint={e}
                  provedor={provedores.find(p => p.id === e.provedor_id)}
                  selected={selected.includes(e.id)}
                  onToggle={(id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])}
                  onEdit={openForm}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <Suspense fallback={<FormModalSkeleton />}>
          <EndpointFormModal 
            endpoint={editing}
            onClose={closeForm}
          />
        </Suspense>
      )}
      
      {viewingEndpoint && (
        <Suspense fallback={<FormModalSkeleton />}>
          <EndpointDetailModal 
            endpoint={viewingEndpoint}
            provedor={viewingProvedor}
            onClose={() => setViewingEndpoint(null)}
            onEdit={(endpoint) => {
              setViewingEndpoint(null);
              openForm(endpoint);
            }}
          />
        </Suspense>
      )}

      {mergingEndpoints && (
        <Suspense fallback={<FormModalSkeleton />}>
          <MergeEndpointsModal
            endpoints={mergingEndpoints}
            onClose={() => setMergingEndpoints(null)}
          />
        </Suspense>
      )}
    </div>
    </ErrorBoundary>
  );
}