import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link as LinkIcon, ExternalLink, Loader2, Sparkles, Plus, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function SugestaoLinksInternos({ conteudo, keywords, categoria, escritorioId, artigoAtualId, onInserirLink }) {
  const [analisando, setAnalisando] = useState(false);
  const [sugestoes, setSugestoes] = useState({ internos: [], externos: [] });

  const { data: artigos = [] } = useQuery({
    queryKey: ['artigos-linkagem', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      const result = await base44.entities.Blog.filter(
        { escritorio_id: escritorioId, publicado: true },
        '-created_date',
        50
      );
      return result.filter(a => a.id !== artigoAtualId);
    },
    enabled: !!escritorioId
  });

  const { data: fontesConfiaveis = [] } = useQuery({
    queryKey: ['fontes-confiaveis', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      const result = await base44.entities.FonteConfiavel.filter(
        { escritorio_id: escritorioId, ativo: true },
        '-created_date',
        30
      );
      return result;
    },
    enabled: !!escritorioId
  });

  const analisar = async () => {
    if (!conteudo || conteudo.length < 100) {
      toast.error('Conteúdo muito curto para análise');
      return;
    }

    if (artigos.length === 0 && fontesConfiaveis.length === 0) {
      toast.error('Nenhum artigo ou fonte disponível');
      return;
    }

    setAnalisando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise o conteúdo e sugira links INTERNOS e EXTERNOS:

CONTEÚDO DO ARTIGO:
${conteudo.slice(0, 3000)}

KEYWORDS: ${keywords?.join(', ') || 'N/A'}
CATEGORIA: ${categoria}

ARTIGOS INTERNOS DISPONÍVEIS (nosso blog):
${artigos.slice(0, 20).map(a => `- "${a.titulo}" (${a.categoria}) [slug: ${a.slug}]`).join('\n')}

FONTES EXTERNAS CONFIÁVEIS:
${fontesConfiaveis.slice(0, 15).map(f => `- ${f.nome} (${f.tipo}) [${f.url_base}]`).join('\n')}

TAREFA:
1. LINKS INTERNOS: Identifique trechos do conteúdo que podem linkar para nossos artigos
   - Texto âncora: trecho EXATO do conteúdo (5-10 palavras)
   - Slug do artigo relacionado
   - Justificativa da relevância
   - Score de relevância (0-10)

2. LINKS EXTERNOS: Identifique onde citar fontes confiáveis
   - Texto âncora: trecho que precisa de citação/referência
   - URL da fonte
   - Nome da fonte
   - Tipo (legislação, jurisprudência, doutrina, etc)
   - Score de autoridade (0-10)

CRITÉRIOS:
- Links internos: temas complementares, aprofundamento, conceitos relacionados
- Links externos: base legal, jurisprudência, dados oficiais, estudos
- Máximo 5 internos + 5 externos
- Priorize relevância > quantidade`,
        response_json_schema: {
          type: "object",
          properties: {
            internos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  texto_ancora: { type: "string" },
                  slug: { type: "string" },
                  titulo_artigo: { type: "string" },
                  justificativa: { type: "string" },
                  relevancia: { type: "number" }
                }
              }
            },
            externos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  texto_ancora: { type: "string" },
                  url: { type: "string" },
                  nome_fonte: { type: "string" },
                  tipo_fonte: { type: "string" },
                  autoridade: { type: "number" }
                }
              }
            }
          }
        }
      });

      setSugestoes({
        internos: resultado.internos || [],
        externos: resultado.externos || []
      });
      
      const total = (resultado.internos?.length || 0) + (resultado.externos?.length || 0);
      toast.success(`${total} links sugeridos (${resultado.internos?.length || 0} internos + ${resultado.externos?.length || 0} externos)`);
    } catch (error) {
      console.error('Erro ao analisar:', error);
      toast.error('Erro ao gerar sugestões');
    } finally {
      setAnalisando(false);
    }
  };

  const inserirLinkInterno = (sug) => {
    const link = `[${sug.texto_ancora}](/BlogPost?slug=${sug.slug} "${sug.titulo_artigo}")`;
    onInserirLink(link);
    toast.success('Link interno inserido!');
  };

  const inserirLinkExterno = (sug) => {
    const link = `[${sug.texto_ancora}](${sug.url} "${sug.nome_fonte} - ${sug.tipo_fonte}")`;
    onInserirLink(link);
    toast.success('Link externo inserido!');
  };

  const totalSugestoes = (sugestoes.internos?.length || 0) + (sugestoes.externos?.length || 0);

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Sugestão de Links
          </span>
          {totalSugestoes > 0 && (
            <Badge className="bg-blue-600 text-white">{totalSugestoes}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={analisar} 
          disabled={analisando || !conteudo}
          size="sm" 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {analisando ? (
            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3 mr-2" />
          )}
          {analisando ? 'Analisando...' : 'Analisar e Sugerir Links'}
        </Button>

        {totalSugestoes > 0 && (
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-4">
              {/* Links Internos */}
              {sugestoes.internos?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                    <p className="text-xs font-semibold">Links Internos ({sugestoes.internos.length})</p>
                  </div>
                  <div className="space-y-2">
                    {sugestoes.internos.map((sug, i) => (
                      <div key={i} className="p-3 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-blue-900 mb-1">
                              {sug.titulo_artigo}
                            </p>
                            <p className="text-xs text-gray-700 mb-1">
                              Âncora: "<span className="font-medium">{sug.texto_ancora}</span>"
                            </p>
                            <p className="text-xs text-gray-600 italic">{sug.justificativa}</p>
                          </div>
                          <Badge 
                            className={sug.relevancia >= 7 ? 'bg-green-600' : 'bg-yellow-600'}
                          >
                            {sug.relevancia}/10
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                          onClick={() => inserirLinkInterno(sug)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Inserir Link Interno
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links Externos */}
              {sugestoes.externos?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-semibold">Links Externos ({sugestoes.externos.length})</p>
                  </div>
                  <div className="space-y-2">
                    {sugestoes.externos.map((sug, i) => (
                      <div key={i} className="p-3 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-bold text-green-900">
                                {sug.nome_fonte}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {sug.tipo_fonte}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-700 mb-1">
                              Âncora: "<span className="font-medium">{sug.texto_ancora}</span>"
                            </p>
                            <p className="text-xs text-gray-500 truncate">{sug.url}</p>
                          </div>
                          <Badge 
                            className={sug.autoridade >= 7 ? 'bg-green-600' : 'bg-yellow-600'}
                          >
                            {sug.autoridade}/10
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-xs"
                          onClick={() => inserirLinkExterno(sug)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Inserir Link Externo
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {!analisando && totalSugestoes === 0 && artigos.length > 0 && (
          <p className="text-xs text-center text-gray-500 py-4">
            Clique em "Analisar" para gerar sugestões de links internos e externos baseados no conteúdo.
          </p>
        )}
      </CardContent>
    </Card>
  );
}