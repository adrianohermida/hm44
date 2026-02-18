import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sparkles, Tag, TrendingUp, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CategorizadorIA({ artigo, onAplicar, escritorioId }) {
  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias-blog', escritorioId],
    queryFn: () => base44.entities.CategoriaBlog.filter(
      { escritorio_id: escritorioId, ativo: true }, 
      'ordem'
    ),
    enabled: !!escritorioId
  });
  const [analisando, setAnalisando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const analisar = async () => {
    if (!artigo.titulo && !artigo.topicos?.length) {
      toast.error('Adicione título ou conteúdo primeiro');
      return;
    }

    setAnalisando(true);
    setResultado(null);

    try {
      const conteudo = artigo.topicos?.map(t => t.texto || '').join(' ') || '';
      
      const { data } = await base44.functions.invoke('categorizarArtigoIA', {
        titulo: artigo.titulo,
        conteudo,
        resumo: artigo.resumo
      });

      setResultado(data);
      toast.success('✨ Análise concluída!');
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setAnalisando(false);
    }
  };

  const aplicarCategoria = () => {
    if (!resultado) return;
    
    onAplicar({
      categoria: resultado.categoria,
      keywords: resultado.keywords_sugeridas || artigo.keywords
    });
    
    toast.success('✨ Categoria e keywords aplicadas!');
    setResultado(null);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-600" />
          <Label className="font-semibold">Categorização Inteligente</Label>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={analisar}
          disabled={analisando || (!artigo.titulo && !artigo.topicos?.length)}
        >
          {analisando ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3 mr-1" />
          )}
          {analisando ? 'Analisando...' : 'Analisar com IA'}
        </Button>
      </div>

      {resultado && (
        <div className="space-y-3 mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-900">Categoria Sugerida:</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {categorias.find(c => c.slug === resultado.categoria)?.emoji}
              </span>
              <span className="text-sm font-bold text-purple-900">
                {categorias.find(c => c.slug === resultado.categoria)?.nome}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-purple-600" />
            <span className="text-xs text-purple-700">
              Confiança: {resultado.confianca}%
            </span>
          </div>

          <p className="text-xs text-purple-800 bg-white/50 rounded p-2">
            {resultado.justificativa}
          </p>

          {resultado.keywords_sugeridas?.length > 0 && (
            <div>
              <span className="text-xs font-medium text-purple-900">Keywords sugeridas:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {resultado.keywords_sugeridas.map((kw, i) => (
                  <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-purple-200">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button
            size="sm"
            onClick={aplicarCategoria}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Tag className="w-3 h-3 mr-1" />
            Aplicar Categoria + Keywords
          </Button>
        </div>
      )}

      <div className="mt-3">
        <Label className="text-xs mb-2 block">Ou escolha manualmente:</Label>
        <Select value={artigo.categoria} onValueChange={(v) => onAplicar({ categoria: v })}>
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categorias.map(cat => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.emoji} {cat.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}