import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ModuloNav from '@/components/conectores/ModuloNav';
import TabelaPrecificacao from '@/components/precificacao/TabelaPrecificacao';
import PrecosBulkEditor from '@/components/precificacao/PrecosBulkEditor';
import ImportarPrecosButton from '@/components/precificacao/ImportarPrecosButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Zap } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import { toast } from 'sonner';

export default function Precificador() {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const queryClient = useQueryClient();

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

  const { data: precos = [], isLoading } = useQuery({
    queryKey: ['precificacao', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return await base44.entities.PrecificacaoEndpoint.filter({ escritorio_id: escritorio.id });
    },
    enabled: !!escritorio?.id
  });

  const updateMutation = useMutation({
    mutationFn: (preco) => base44.entities.PrecificacaoEndpoint.update(preco.id, preco),
    onSuccess: () => queryClient.invalidateQueries(['precificacao'])
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async (precos) => {
      await Promise.all(precos.map(p => base44.entities.PrecificacaoEndpoint.update(p.id, p)));
    },
    onSuccess: () => queryClient.invalidateQueries(['precificacao'])
  });

  const categorias = [...new Set(precos.map(p => p.categoria))];
  
  const filteredPrecos = precos.filter(p => {
    const matchBusca = p.titulo?.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaFiltro === 'todos' || p.categoria === categoriaFiltro;
    return matchBusca && matchCategoria;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') },
        { label: 'Precificador' }
      ]} />
      <ModuloNav />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Precificador ({filteredPrecos.length})</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const res = await base44.functions.invoke('seedYouTubeQuotas');
                toast.success(res.data.message || 'Quotas YouTube configuradas');
                queryClient.invalidateQueries(['precificacao']);
              } catch (error) {
                toast.error('Erro ao configurar quotas');
              }
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Configurar Quotas YouTube
          </Button>
          <ImportarPrecosButton 
            escritorioId={escritorio?.id} 
            onSuccess={() => queryClient.invalidateQueries(['precificacao'])} 
          />
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Buscar serviço..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas Categorias</SelectItem>
            {categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <PrecosBulkEditor 
        precos={filteredPrecos} 
        onApply={(updated) => bulkUpdateMutation.mutate(updated)} 
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <TabelaPrecificacao 
          precos={filteredPrecos} 
          onUpdate={(preco) => updateMutation.mutate(preco)} 
        />
      )}
    </div>
  );
}