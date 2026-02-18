import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, FileText, CheckSquare, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function IntencaoBuscaAplicador({ keywords = [], escritorioId, artigoAtualId }) {
  const [analisando, setAnalisando] = useState(false);
  const [analise, setAnalise] = useState(null);
  const navigate = useNavigate();

  const analisarIntencao = async () => {
    if (keywords.length === 0) {
      toast.error('Adicione pelo menos uma palavra-chave');
      return;
    }

    setAnalisando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `ANÁLISE ESTRATÉGICA DE INTENÇÃO DE BUSCA - Nicho Jurídico

KEYWORDS: ${keywords.join(', ')}

MISSÃO: Analise CADA keyword e forneça insights APLICÁVEIS para estratégia de conteúdo.

Para cada keyword, determine:
1. INTENÇÃO PRINCIPAL (informacional/navegacional/transacional/comercial)
2. ESTÁGIO DO FUNIL (ToFu/MoFu/BoFu)
3. TIPO DE CONTEÚDO ideal (guia, checklist, comparativo, case, FAQ, template)
4. TÍTULOS OTIMIZADOS (3 variações com CTR estimado)
5. ESTRUTURA H2 recomendada (5-7 subtítulos)
6. PONTOS-CHAVE obrigatórios a cobrir
7. AÇÕES APLICÁVEIS (criar artigo novo, otimizar existente, criar FAQ, etc)

Seja ESPECÍFICO e PRÁTICO - foco em ações que podem ser tomadas AGORA.`,
        response_json_schema: {
          type: "object",
          properties: {
            analise_keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  intencao: { type: "string" },
                  funil: { type: "string" },
                  tipo_conteudo: { type: "string" },
                  titulos_sugeridos: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        titulo: { type: "string" },
                        ctr_estimado: { type: "number" }
                      }
                    }
                  },
                  estrutura_h2: {
                    type: "array",
                    items: { type: "string" }
                  },
                  pontos_chave: {
                    type: "array",
                    items: { type: "string" }
                  },
                  acoes_recomendadas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        acao: { type: "string" },
                        descricao: { type: "string" },
                        prioridade: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      setAnalise(resultado.analise_keywords || []);
      toast.success('Análise completa com ações aplicáveis!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao analisar intenção de busca');
    } finally {
      setAnalisando(false);
    }
  };

  const adicionarFilaProducao = async (keyword) => {
    try {
      await base44.entities.ArtigoFila.create({
        escritorio_id: escritorioId,
        titulo_proposto: keyword.titulos_sugeridos?.[0]?.titulo || `Guia: ${keyword.keyword}`,
        intencao_busca: keyword.intencao,
        funil: keyword.funil?.includes('ToFu') ? 'topo' : keyword.funil?.includes('MoFu') ? 'meio' : 'fundo',
        keywords: [keyword.keyword],
        estrutura_sugerida: {
          h2: keyword.estrutura_h2,
          pontos_chave: keyword.pontos_chave
        },
        status: 'rascunho',
        prioridade: keyword.acoes_recomendadas?.[0]?.prioridade === 'Alta' ? 10 : 5
      });
      
      toast.success('Artigo adicionado à fila de produção!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao adicionar à fila');
    }
  };

  const aplicarEstrutura = (keyword) => {
    if (!keyword.estrutura_h2 || keyword.estrutura_h2.length === 0) {
      toast.error('Nenhuma estrutura disponível');
      return;
    }

    const estruturaMarkdown = keyword.estrutura_h2.map(h2 => `## ${h2}`).join('\n\n');
    navigator.clipboard.writeText(estruturaMarkdown);
    toast.success('Estrutura copiada! Cole no editor.');
  };

  const getIntencaoColor = (intencao) => {
    const lower = intencao?.toLowerCase() || '';
    if (lower.includes('informacional')) return 'bg-blue-100 text-blue-800';
    if (lower.includes('transacional')) return 'bg-green-100 text-green-800';
    if (lower.includes('comercial')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getFunilColor = (funil) => {
    if (funil?.includes('ToFu') || funil?.includes('topo')) return 'bg-yellow-100 text-yellow-800';
    if (funil?.includes('MoFu') || funil?.includes('meio')) return 'bg-orange-100 text-orange-800';
    if (funil?.includes('BoFu') || funil?.includes('fundo')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Intenção de Busca & Aplicação</span>
        </div>
        <Button 
          size="sm" 
          onClick={analisarIntencao} 
          disabled={analisando || keywords.length === 0}
        >
          <Sparkles className={`w-3 h-3 mr-1 ${analisando ? 'animate-pulse' : ''}`} />
          {analisando ? 'Analisando...' : 'Analisar'}
        </Button>
      </div>

      {keywords.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Adicione palavras-chave para análise estratégica
        </p>
      )}

      {analise && analise.length > 0 && (
        <div className="space-y-4 mt-4">
          {analise.map((kw, idx) => (
            <div key={idx} className="border-2 border-blue-200 rounded-lg p-4 space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[var(--brand-primary)]" />
                    <span className="font-bold">{kw.keyword}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getIntencaoColor(kw.intencao)}>{kw.intencao}</Badge>
                    <Badge className={getFunilColor(kw.funil)}>{kw.funil}</Badge>
                    <Badge variant="outline" className="text-xs">{kw.tipo_conteudo}</Badge>
                  </div>
                </div>
              </div>

              {/* Títulos Otimizados */}
              {kw.titulos_sugeridos?.length > 0 && (
                <div className="bg-white p-3 rounded border border-blue-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">📝 Títulos Otimizados:</p>
                  {kw.titulos_sugeridos.map((tit, i) => (
                    <div key={i} className="flex items-center justify-between mb-2 last:mb-0">
                      <div className="flex-1">
                        <p className="text-sm">{tit.titulo}</p>
                        <p className="text-xs text-gray-500">CTR estimado: ~{tit.ctr_estimado}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Estrutura H2 */}
              {kw.estrutura_h2?.length > 0 && (
                <div className="bg-white p-3 rounded border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-700">🏗️ Estrutura Recomendada:</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => aplicarEstrutura(kw)}
                      className="h-6 text-xs"
                    >
                      Copiar
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {kw.estrutura_h2.slice(0, 5).map((h2, i) => (
                      <div key={i} className="text-xs text-gray-600 pl-2 border-l-2 border-green-300">
                        {h2}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pontos-Chave */}
              {kw.pontos_chave?.length > 0 && (
                <div className="bg-white p-3 rounded border border-purple-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">✅ Pontos-Chave a Cobrir:</p>
                  <div className="flex flex-wrap gap-1">
                    {kw.pontos_chave.map((ponto, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {ponto}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações Recomendadas */}
              {kw.acoes_recomendadas?.length > 0 && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 rounded border border-yellow-200">
                  <p className="text-xs font-medium text-gray-900 mb-2">🎯 Ações Recomendadas:</p>
                  <div className="space-y-2">
                    {kw.acoes_recomendadas.map((acao, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckSquare className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{acao.acao}</p>
                            <Badge className={
                              acao.prioridade?.toLowerCase() === 'alta' ? 'bg-red-600' :
                              acao.prioridade?.toLowerCase() === 'média' ? 'bg-yellow-600' :
                              'bg-green-600'
                            } className="text-white text-xs">
                              {acao.prioridade}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{acao.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão Adicionar à Fila */}
              <Button
                size="sm"
                onClick={() => adicionarFilaProducao(kw)}
                className="w-full"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adicionar à Fila de Produção
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}