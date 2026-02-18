import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ArtigosRelacionadosManager({ artigoId, filaId, escritorioId }) {
  const queryClient = useQueryClient();

  const { data: itemFila } = useQuery({
    queryKey: ['artigo-fila-item', filaId],
    queryFn: () => base44.entities.ArtigoFila.filter({ id: filaId }),
    enabled: !!filaId,
    select: (data) => data[0]
  });

  const { data: relacionados = [] } = useQuery({
    queryKey: ['artigos-relacionados', itemFila?.artigos_relacionados],
    queryFn: async () => {
      if (!itemFila?.artigos_relacionados?.length) return [];
      
      const artigos = await Promise.all(
        itemFila.artigos_relacionados.map(id => 
          base44.entities.Blog.filter({ id }).then(r => r[0])
        )
      );
      return artigos.filter(Boolean);
    },
    enabled: !!itemFila?.artigos_relacionados?.length
  });

  const vincularMutation = useMutation({
    mutationFn: async () => {
      if (!filaId || !artigoId) return;

      // Buscar artigos da mesma keyword/categoria
      const artigosRelacionados = await base44.entities.Blog.filter({
        escritorio_id: escritorioId,
        categoria: itemFila?.categoria,
        publicado: true
      });

      const relacionadosIds = artigosRelacionados
        .filter(a => a.id !== artigoId)
        .slice(0, 3)
        .map(a => a.id);

      // Atualizar item da fila
      await base44.entities.ArtigoFila.update(filaId, {
        artigo_id: artigoId,
        artigos_relacionados: relacionadosIds
      });

      // Atualizar artigo com links relacionados
      const linksHtml = relacionadosIds.map(id => {
        const artigo = artigosRelacionados.find(a => a.id === id);
        return `[${artigo?.titulo}](/BlogPost?id=${id})`;
      }).join('\n');

      return linksHtml;
    },
    onSuccess: (linksHtml) => {
      queryClient.invalidateQueries(['artigos-relacionados']);
      toast.success('Artigos relacionados vinculados!');
    }
  });

  useEffect(() => {
    if (artigoId && filaId && !itemFila?.artigo_id) {
      vincularMutation.mutate();
    }
  }, [artigoId, filaId]);

  if (!itemFila || relacionados.length === 0) return null;

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Link2 className="w-4 h-4 text-blue-600" />
          Artigos Relacionados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {relacionados.map(artigo => (
          <div key={artigo.id} className="p-2 border rounded text-sm">
            <p className="font-semibold">{artigo.titulo}</p>
            <Badge variant="outline" className="mt-1">{artigo.categoria}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}