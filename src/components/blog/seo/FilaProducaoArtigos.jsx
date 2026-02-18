import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, Clock, Archive, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FilaProducaoArtigos({ escritorioId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: fila = [] } = useQuery({
    queryKey: ['artigos-fila', escritorioId],
    queryFn: () => base44.entities.ArtigoFila.filter(
      { escritorio_id: escritorioId },
      '-prioridade'
    ),
    enabled: !!escritorioId
  });

  const iniciarMutation = useMutation({
    mutationFn: async (item) => {
      await base44.entities.ArtigoFila.update(item.id, {
        status: 'em_desenvolvimento'
      });
      
      navigate(`/EditorBlog?filaId=${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['artigos-fila']);
    }
  });

  const arquivarMutation = useMutation({
    mutationFn: (id) => base44.entities.ArtigoFila.update(id, {
      status: 'arquivado'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['artigos-fila']);
      toast.success('Artigo arquivado');
    }
  });

  const statusConfig = {
    rascunho: { label: 'Rascunho', icon: Clock, color: 'bg-gray-500' },
    em_desenvolvimento: { label: 'Em Desenvolvimento', icon: PlayCircle, color: 'bg-blue-500' },
    sob_aprovacao: { label: 'Sob Aprovação', icon: Clock, color: 'bg-yellow-500' },
    publicado: { label: 'Publicado', icon: CheckCircle, color: 'bg-green-500' },
    arquivado: { label: 'Arquivado', icon: Archive, color: 'bg-gray-400' }
  };

  const filaNaoArquivada = fila.filter(f => f.status !== 'arquivado');

  if (filaNaoArquivada.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Fila de Produção</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {filaNaoArquivada.map((item) => {
          const StatusIcon = statusConfig[item.status].icon;
          return (
            <div key={item.id} className="p-3 border rounded hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.titulo_proposto}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${statusConfig[item.status].color} text-white`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[item.status].label}
                    </Badge>
                    <Badge variant="outline">{item.funil}</Badge>
                    <Badge variant="outline">{item.intencao_busca}</Badge>
                    {item.score_atual > 0 && (
                      <Badge className="bg-purple-600 text-white">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {item.score_atual}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {item.status === 'rascunho' && (
                    <Button size="sm" onClick={() => iniciarMutation.mutate(item)}>
                      Iniciar
                    </Button>
                  )}
                  {item.status === 'publicado' && item.artigo_id && (
                    <Button size="sm" variant="outline" onClick={() => navigate(`/EditorBlog?id=${item.artigo_id}`)}>
                      Ver
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => arquivarMutation.mutate(item.id)}>
                    <Archive className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}