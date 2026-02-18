import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, RotateCcw, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import moment from 'moment';

export default function HistoricoVersoes({ artigoId, onRestaurar }) {
  const [expandida, setExpandida] = useState(null);

  const { data: versoes = [] } = useQuery({
    queryKey: ['blog-versoes', artigoId],
    queryFn: async () => {
      if (!artigoId) return [];
      const result = await base44.entities.BlogVersion.filter(
        { blog_id: artigoId },
        '-versao_numero',
        50
      );
      return result;
    },
    enabled: !!artigoId
  });

  const restaurarVersao = async (versao) => {
    if (!confirm(`Restaurar versão ${versao.versao_numero}? Isso criará uma nova versão com este conteúdo.`)) {
      return;
    }

    try {
      onRestaurar({
        titulo: versao.titulo,
        conteudo: versao.conteudo,
        topicos: versao.topicos,
        meta_description: versao.meta_description,
        keywords: versao.keywords
      });
      toast.success(`Versão ${versao.versao_numero} restaurada!`);
    } catch (error) {
      toast.error('Erro ao restaurar versão');
    }
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      manual: 'Manual',
      ia_estrutura: 'IA - Estrutura',
      ia_gaps: 'IA - Gaps SEO',
      ia_otimizacao: 'IA - Otimização',
      ab_test: 'A/B Test'
    };
    return labels[tipo] || tipo;
  };

  const getTipoColor = (tipo) => {
    const colors = {
      manual: 'bg-blue-100 text-blue-800',
      ia_estrutura: 'bg-purple-100 text-purple-800',
      ia_gaps: 'bg-orange-100 text-orange-800',
      ia_otimizacao: 'bg-green-100 text-green-800',
      ab_test: 'bg-pink-100 text-pink-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  if (!artigoId) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="w-4 h-4" />
          Histórico de Versões
          <Badge variant="outline">{versoes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {versoes.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            Nenhuma versão salva ainda
          </p>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {versoes.map((versao) => (
                <div
                  key={versao.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getTipoColor(versao.tipo_mudanca)}>
                          {getTipoLabel(versao.tipo_mudanca)}
                        </Badge>
                        <span className="text-xs font-semibold">
                          v{versao.versao_numero}
                        </span>
                        <span className="text-xs text-gray-500">
                          {moment(versao.created_date).fromNow()}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-900 mb-1">
                        {versao.titulo}
                      </p>
                      {versao.descricao_mudanca && (
                        <p className="text-xs text-gray-600">
                          {versao.descricao_mudanca}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandida(expandida === versao.id ? null : versao.id)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => restaurarVersao(versao)}
                        title="Restaurar esta versão"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {expandida === versao.id && (
                    <div className="mt-2 pt-2 border-t space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">SEO Score:</span>
                          <span className="ml-1 font-semibold">{versao.score_seo || 0}/100</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Autor:</span>
                          <span className="ml-1 font-medium">{versao.autor_mudanca}</span>
                        </div>
                      </div>
                      
                      {versao.meta_description && (
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500 mb-1">Meta Description:</p>
                          <p className="text-xs">{versao.meta_description}</p>
                        </div>
                      )}

                      {versao.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {versao.keywords.map((kw, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}