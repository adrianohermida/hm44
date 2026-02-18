import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Plus, TrendingUp, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default React.memo(function AnaliseFunilConteudo({ escritorioId }) {
  const [analisando, setAnalisando] = useState(false);
  const [gaps, setGaps] = useState(null);
  const navigate = useNavigate();

  const { data: artigos = [], isLoading: loadingArtigos } = useQuery({
    queryKey: ['artigos-funil', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return base44.entities.Blog.filter({ 
        escritorio_id: escritorioId,
        publicado: true 
      });
    },
    enabled: !!escritorioId,
    retry: 3,
    staleTime: 5 * 60 * 1000
  });

  const { data: keywords = [], isLoading: loadingKeywords } = useQuery({
    queryKey: ['keywords-funil', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return base44.entities.SEOKeyword.filter({ 
        escritorio_id: escritorioId 
      });
    },
    enabled: !!escritorioId,
    retry: 3,
    staleTime: 5 * 60 * 1000
  });

  if (loadingArtigos || loadingKeywords) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />;
  }

  const analisarFunil = async () => {
    setAnalisando(true);
    try {
      const artigosResumo = artigos.map(a => ({
        titulo: a.titulo,
        categoria: a.categoria,
        keywords: a.keywords,
        visualizacoes: a.visualizacoes
      }));

      const keywordsResumo = keywords.map(k => ({
        keyword: k.keyword,
        funil: k.funil,
        volume: k.volume,
        artigo_id: k.artigo_id
      }));

      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `ANÁLISE DE FUNIL DE CONTEÚDO - Estratégia SEO Jurídica

ARTIGOS EXISTENTES:
${JSON.stringify(artigosResumo, null, 2)}

KEYWORDS MAPEADAS:
${JSON.stringify(keywordsResumo, null, 2)}

MISSÃO: Identifique GAPS críticos no funil de conteúdo e sugira artigos específicos.

ANÁLISE REQUERIDA:

1. DISTRIBUIÇÃO ATUAL DO FUNIL:
   - ToFu (Topo - Consciência): quantos artigos?
   - MoFu (Meio - Consideração): quantos artigos?
   - BoFu (Fundo - Decisão): quantos artigos?

2. GAPS CRÍTICOS:
   - Keywords sem artigo correspondente
   - Estágios do funil sub-representados
   - Temas complementares faltantes
   - Oportunidades de encadeamento interno

3. ARTIGOS PRIORITÁRIOS A CRIAR:
   Para cada gap, sugira:
   - Título otimizado
   - Tipo de conteúdo (guia/checklist/FAQ/case)
   - Keywords-alvo
   - Como se conecta com artigos existentes (links internos)
   - Impacto estimado (visualizações potenciais)
   - Prioridade (Alta/Média/Baixa)

4. ARTIGOS PARA APROFUNDAR:
   - Quais artigos existentes podem ser expandidos?
   - Que tópicos aprofundar?
   - Oportunidades de criar séries/guias completos

Retorne análise ESTRATÉGICA e PRÁTICA.`,
        response_json_schema: {
          type: "object",
          properties: {
            distribuicao_funil: {
              type: "object",
              properties: {
                tofu: { type: "number" },
                mofu: { type: "number" },
                bofu: { type: "number" }
              }
            },
            gaps_criticos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo_sugerido: { type: "string" },
                  tipo_conteudo: { type: "string" },
                  keywords_alvo: { type: "array", items: { type: "string" } },
                  funil: { type: "string" },
                  conecta_com_artigos: { type: "array", items: { type: "string" } },
                  impacto_estimado: { type: "string" },
                  prioridade: { type: "string" },
                  razao_gap: { type: "string" },
                  conteudo_inicial: { type: "string" }
                }
              }
            },
            artigos_para_expandir: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo_artigo_existente: { type: "string" },
                  topicos_aprofundar: { type: "array", items: { type: "string" } },
                  tipo_expansao: { type: "string" },
                  beneficio: { type: "string" }
                }
              }
            }
          }
        }
      });

      setGaps(resultado);
      toast.success('Análise de funil completa!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao analisar funil');
    } finally {
      setAnalisando(false);
    }
  };

  const criarArtigoGap = async (gap) => {
    try {
      const topicosIniciais = [];
      
      // Adicionar estrutura H2 sugerida
      if (gap.estrutura_h2_sugerida?.length > 0) {
        gap.estrutura_h2_sugerida.forEach((h2, i) => {
          topicosIniciais.push({
            id: Date.now() + i * 2,
            tipo: 'h2',
            texto: h2
          });
          // Adicionar parágrafo placeholder após cada H2
          topicosIniciais.push({
            id: Date.now() + i * 2 + 1,
            tipo: 'paragrafo',
            texto: `[Desenvolva este tópico aqui - ${h2}]`
          });
        });
      }

      const dados = {
        titulo: gap.titulo_sugerido,
        categoria: 'direito_consumidor',
        keywords: gap.keywords_alvo || [],
        topicos: topicosIniciais,
        resumo: gap.conteudo_inicial || gap.razao_gap || '',
        status: 'rascunho',
        escritorio_id: escritorioId
      };

      const novoArtigo = await base44.entities.Blog.create(dados);
      toast.success('Artigo estruturado criado! Complete o conteúdo.');
      setTimeout(() => navigate(`/EditorBlog?id=${novoArtigo.id}`), 800);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar artigo');
    }
  };

  const getFunilColor = (funil) => {
    if (funil?.toLowerCase().includes('tofu') || funil?.toLowerCase().includes('topo')) return 'bg-yellow-100 text-yellow-800';
    if (funil?.toLowerCase().includes('mofu') || funil?.toLowerCase().includes('meio')) return 'bg-orange-100 text-orange-800';
    if (funil?.toLowerCase().includes('bofu') || funil?.toLowerCase().includes('fundo')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPrioridadeColor = (prioridade) => {
    if (prioridade?.toLowerCase() === 'alta') return 'bg-red-600';
    if (prioridade?.toLowerCase() === 'média') return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg">Análise de Funil & Gaps de Conteúdo</h3>
          </div>
          <Button onClick={analisarFunil} disabled={analisando}>
            <Sparkles className={`w-4 h-4 mr-2 ${analisando ? 'animate-pulse' : ''}`} />
            {analisando ? 'Analisando...' : 'Analisar Funil'}
          </Button>
        </div>

        {gaps && (
          <div className="space-y-4">
            {/* Distribuição do Funil */}
            {gaps.distribuicao_funil && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
                  <p className="text-xs text-yellow-700 mb-1">ToFu (Consciência)</p>
                  <p className="text-3xl font-bold text-yellow-900">{gaps.distribuicao_funil.tofu}</p>
                  <p className="text-xs text-yellow-600 mt-1">artigos</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
                  <p className="text-xs text-orange-700 mb-1">MoFu (Consideração)</p>
                  <p className="text-3xl font-bold text-orange-900">{gaps.distribuicao_funil.mofu}</p>
                  <p className="text-xs text-orange-600 mt-1">artigos</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                  <p className="text-xs text-red-700 mb-1">BoFu (Decisão)</p>
                  <p className="text-3xl font-bold text-red-900">{gaps.distribuicao_funil.bofu}</p>
                  <p className="text-xs text-red-600 mt-1">artigos</p>
                </div>
              </div>
            )}

            {/* Gaps Críticos */}
            {gaps.gaps_criticos?.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  Gaps Críticos Identificados ({gaps.gaps_criticos.length})
                </h4>
                <div className="space-y-3">
                  {gaps.gaps_criticos.map((gap, i) => (
                    <div key={i} className="border-2 border-blue-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-sm mb-1">{gap.titulo_sugerido}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getFunilColor(gap.funil)}>{gap.funil}</Badge>
                            <Badge className={`${getPrioridadeColor(gap.prioridade)} text-white`}>
                              {gap.prioridade}
                            </Badge>
                            <Badge variant="outline">{gap.tipo_conteudo}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-2 rounded text-xs mb-2">
                        <p className="font-medium text-gray-700 mb-1">💡 Por que criar:</p>
                        <p className="text-gray-600">{gap.razao_gap}</p>
                      </div>

                      <div className="bg-purple-50 p-2 rounded text-xs mb-2">
                        <p className="font-medium text-purple-900 mb-1">📊 Impacto Estimado:</p>
                        <p className="text-gray-700">{gap.impacto_estimado}</p>
                      </div>

                      {gap.keywords_alvo?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {gap.keywords_alvo.map((kw, j) => (
                            <Badge key={j} variant="outline" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {gap.conecta_com_artigos?.length > 0 && (
                        <div className="bg-blue-50 p-2 rounded text-xs mb-2">
                          <p className="font-medium text-blue-900 mb-1">🔗 Links Internos com:</p>
                          {gap.conecta_com_artigos.map((link, j) => (
                            <p key={j} className="text-blue-700">• {link}</p>
                          ))}
                        </div>
                      )}

                      <Button
                        size="sm"
                        onClick={() => criarArtigoGap(gap)}
                        className="w-full"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Criar Este Artigo
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artigos para Expandir */}
            {gaps.artigos_para_expandir?.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Artigos para Expandir ({gaps.artigos_para_expandir.length})
                </h4>
                <div className="space-y-2">
                  {gaps.artigos_para_expandir.map((exp, i) => (
                    <div key={i} className="border border-green-200 rounded-lg p-3 bg-green-50">
                      <p className="font-medium text-sm mb-2">{exp.titulo_artigo_existente}</p>
                      <Badge variant="outline" className="mb-2">{exp.tipo_expansao}</Badge>
                      <div className="bg-white p-2 rounded text-xs mb-2">
                        <p className="font-medium text-gray-700 mb-1">📌 Tópicos a Aprofundar:</p>
                        {exp.topicos_aprofundar?.map((top, j) => (
                          <p key={j} className="text-gray-600">• {top}</p>
                        ))}
                      </div>
                      <p className="text-xs text-green-700 italic">{exp.beneficio}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
});