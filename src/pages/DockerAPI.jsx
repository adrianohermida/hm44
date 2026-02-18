import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ModuloNav from '@/components/conectores/ModuloNav';
import DockerUploadZone from '@/components/conectores/docker/DockerUploadZone';
import DockerAnalisesList from '@/components/conectores/docker/DockerAnalisesList';
import DockerAnaliseDetail from '@/components/conectores/docker/DockerAnaliseDetail';
import DockerURLInput from '@/components/conectores/docker/DockerURLInput';
import DockerBulkActions from '@/components/conectores/docker/DockerBulkActions';
import DockerFilters from '@/components/conectores/docker/DockerFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DockerAPI() {
  const [selectedAnalise, setSelectedAnalise] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    },
    enabled: !!user?.email
  });

  const { data: analises = [], refetch, isLoading: loadingAnalises } = useQuery({
    queryKey: ['docker-analises', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return await base44.entities.DockerAnalise.filter({ escritorio_id: escritorio.id }, '-created_date');
    },
    enabled: !!escritorio?.id,
    staleTime: 10000,
    refetchOnWindowFocus: false
  });

  // Refetch manual apenas se houver análises em processamento
  React.useEffect(() => {
    const hasProcessing = analises?.some(a => 
      a.status === 'PROCESSANDO' || a.status === 'PENDENTE'
    );
    
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      refetch();
    }, 15000); // 15 segundos quando processando

    return () => clearInterval(interval);
  }, [analises, refetch]);

  // Filtrar análises
  const analisesFiltradas = useMemo(() => {
    return analises.filter(a => {
      const matchSearch = !search || 
        a.titulo?.toLowerCase().includes(search.toLowerCase()) ||
        a.url_documentacao?.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = statusFilter === 'TODOS' || a.status === statusFilter;
      
      return matchSearch && matchStatus;
    });
  }, [analises, search, statusFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') },
        { label: 'Docker API' }
      ]} />
      <ModuloNav />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Docker API - Análise Inteligente</h1>
          <p className="text-[var(--text-secondary)] mt-1">Upload ou URL para extração automática de endpoints</p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Análise
        </Button>
      </div>

      {showUpload && escritorio?.id && (
        <div className="mb-6">
          <Tabs defaultValue="url">
            <TabsList>
              <TabsTrigger value="url">Extrair de URL</TabsTrigger>
              <TabsTrigger value="upload">Upload de Arquivo</TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <DockerURLInput 
                escritorioId={escritorio.id}
                onAnaliseCreated={(id) => {
                  refetch();
                  setShowUpload(false);
                  setTimeout(() => {
                    const analise = analises.find(a => a.id === id);
                    if (analise) setSelectedAnalise(analise);
                  }, 500);
                }} 
              />
            </TabsContent>
            <TabsContent value="upload">
              <DockerUploadZone 
                escritorioId={escritorio.id} 
                onUploadComplete={() => { 
                  refetch(); 
                  setShowUpload(false); 
                }} 
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {loadingAnalises ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="h-64 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          </div>
          <div className="lg:col-span-2">
            <div className="h-64 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          </div>
        </div>
      ) : analises.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg border-2 border-dashed">
          <p className="text-[var(--text-secondary)] mb-4">Nenhuma análise criada ainda</p>
          <Button onClick={() => setShowUpload(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Análise
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <DockerFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />
          
          <DockerBulkActions 
            selectedIds={selectedIds}
            onClear={() => {
              setSelectedIds([]);
              refetch();
            }}
          />

          {analisesFiltradas.length === 0 ? (
            <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg border-2 border-dashed">
              <p className="text-[var(--text-secondary)]">Nenhuma análise encontrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <DockerAnalisesList 
                  analises={analisesFiltradas} 
                  selectedId={selectedAnalise?.id}
                  onSelect={setSelectedAnalise}
                  selectedIds={selectedIds}
                  onToggleSelect={setSelectedIds}
                />
              </div>
              
              <div className="lg:col-span-2">
                {selectedAnalise ? (
                  <DockerAnaliseDetail analise={selectedAnalise} onUpdate={refetch} />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-[var(--bg-secondary)] rounded-lg border-2 border-dashed">
                    <p className="text-[var(--text-tertiary)]">Selecione uma análise à esquerda</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}