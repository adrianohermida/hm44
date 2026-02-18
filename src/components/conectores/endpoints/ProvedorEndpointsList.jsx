import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import EndpointListItem from './EndpointListItem';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function ProvedorEndpointsList({ provedorId }) {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  
  const { data: endpoints = [], isLoading } = useQuery({
    queryKey: ['endpoints-provedor', provedorId],
    queryFn: async () => {
      if (!provedorId) return [];
      return await base44.entities.EndpointAPI.filter({ provedor_id: provedorId });
    },
    enabled: !!provedorId,
    staleTime: 3 * 60 * 1000
  });

  const endpointsFiltrados = endpoints.filter(ep => {
    const termo = busca.toLowerCase();
    return ep.nome?.toLowerCase().includes(termo) || 
           ep.path?.toLowerCase().includes(termo) ||
           ep.categoria?.toLowerCase().includes(termo);
  });

  if (isLoading) return <LoadingState message="Carregando endpoints..." />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Endpoints ({endpoints.length})</CardTitle>
          <Button size="sm" onClick={() => navigate(createPageUrl('AdminEndpoints') + `?provedor=${provedorId}`)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {endpoints.length === 0 ? (
          <EmptyState 
            title="Nenhum endpoint cadastrado"
            description="Crie o primeiro endpoint para este provedor"
          />
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <Input
                placeholder="Buscar endpoints..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {endpointsFiltrados.length === 0 ? (
                <p className="text-sm text-[var(--text-tertiary)] text-center py-4">
                  Nenhum endpoint encontrado
                </p>
              ) : (
                endpointsFiltrados.map(ep => (
                  <EndpointListItem key={ep.id} endpoint={ep} showHealth />
                ))
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}