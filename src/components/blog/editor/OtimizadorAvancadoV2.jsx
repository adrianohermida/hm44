import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, TrendingUp, ArrowRight, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function OtimizadorAvancadoV2({ artigo, onAplicar }) {
  const [otimizando, setOtimizando] = useState(false);
  const [comparativo, setComparativo] = useState(null);

  const analisar = async () => {
    setOtimizando(true);
    try {
      const conteudo = artigo.topicos.map(t => t.texto || t.itens?.join(' ') || '').join('\n');
      
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `ANÁLISE COMPARATIVA SEO - Artigo Jurídico

DADOS ATUAIS:
Título: "${artigo.titulo}"
Meta: "${artigo.meta_description || 'não definida'}"
Keywords: ${artigo.keywords?.join(', ') || 'nenhuma'}
Score SEO Atual: ${artigo.score_seo_atual || 0}/100
Visualizações: ${artigo.visualizacoes || 0}
Conteúdo: ${conteudo.substring(0, 1500)}

MISSÃO: Forneça análise COMPARATIVA detalhada com JUSTIFICATIVAS quantificadas.

Para CADA otimização, retorne:
1. VERSÃO ATUAL vs VERSÃO OTIMIZADA
2. SCORE ANTES vs SCORE DEPOIS (estimado)
3. JUSTIFICATIVA ESPECÍFICA (por que mudar?)
4. IMPACTO ESPERADO (CTR, visualizações, posição SERP)
5. PRIORIDADE (Alta/Média/Baixa)

FOCO EM:
- Título: análise de CTR potencial, palavra-chave posicionamento, comprimento
- Meta: análise de persuasão, CTA, densidade de keywords
- Keywords: gaps de oportunidade, volume de busca, dificuldade
- Estrutura: H2/H3 otimizados, legibilidade, user intent

Retorne JSON estruturado com comparativos detalhados.`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo_analise: {
              type: "object",
              properties: {
                atual: { type: "string" },
                otimizado: { type: "string" },
                score_antes: { type: "number" },
                score_depois: { type: "number" },
                justificativa: { type: "string" },
                impacto_estimado: { type: "string" },
                prioridade: { type: "string" }
              }
            },
            meta_analise: {
              type: "object",
              properties: {
                atual: { type: "string" },
                otimizado: { type: "string" },
                score_antes: { type: "number" },
                score_depois: { type: "number" },
                justificativa: { type: "string" },
                impacto_estimado: { type: "string" },
                prioridade: { type: "string" }
              }
            },
            keywords_analise: {
              type: "object",
              properties: {
                atuais: { type: "array", items: { type: "string" } },
                sugeridas_adicionar: { type: "array", items: { type: "string" } },
                sugeridas_remover: { type: "array", items: { type: "string" } },
                justificativa: { type: "string" },
                gaps_oportunidade: { type: "array", items: { type: "string" } }
              }
            },
            melhorias_estrutura: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipo: { type: "string" },
                  descricao: { type: "string" },
                  impacto: { type: "string" },
                  aplicavel_automaticamente: { type: "boolean" }
                }
              }
            },
            score_geral_estimado: { type: "number" }
          }
        }
      });

      setComparativo(resultado);
      toast.success('Análise comparativa completa!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro na análise');
    } finally {
      setOtimizando(false);
    }
  };

  const aplicarOtimizacao = (campo) => {
    if (!comparativo) return;
    
    const updates = {};
    if (campo === 'titulo' && comparativo.titulo_analise) {
      updates.titulo = comparativo.titulo_analise.otimizado;
    }
    if (campo === 'meta' && comparativo.meta_analise) {
      updates.meta_description = comparativo.meta_analise.otimizado;
    }
    if (campo === 'keywords' && comparativo.keywords_analise) {
      const keywordsAtuais = artigo.keywords || [];
      const novasKeywords = [
        ...keywordsAtuais.filter(k => !comparativo.keywords_analise.sugeridas_remover?.includes(k)),
        ...(comparativo.keywords_analise.sugeridas_adicionar || [])
      ];
      updates.keywords = [...new Set(novasKeywords)];
    }
    
    onAplicar(updates);
    toast.success(`${campo === 'titulo' ? 'Título' : campo === 'meta' ? 'Meta' : 'Keywords'} otimizado!`);
  };

  const aplicarKeywordIndividual = (keyword) => {
    const keywordsAtuais = artigo.keywords || [];
    if (!keywordsAtuais.includes(keyword)) {
      onAplicar({ keywords: [...keywordsAtuais, keyword] });
      toast.success(`Keyword "${keyword}" adicionada!`);
    }
  };

  const removerKeywordIndividual = (keyword) => {
    const keywordsAtuais = artigo.keywords || [];
    onAplicar({ keywords: keywordsAtuais.filter(k => k !== keyword) });
    toast.success(`Keyword "${keyword}" removida!`);
  };

  const aplicarTodas = () => {
    if (!comparativo) return;

    const updates = {};
    
    if (comparativo.titulo_analise?.otimizado) {
      updates.titulo = comparativo.titulo_analise.otimizado;
    }
    
    if (comparativo.meta_analise?.otimizado) {
      updates.meta_description = comparativo.meta_analise.otimizado;
    }
    
    if (comparativo.keywords_analise) {
      const keywordsAtuais = artigo.keywords || [];
      const novasKeywords = [
        ...keywordsAtuais.filter(k => !comparativo.keywords_analise.sugeridas_remover?.includes(k)),
        ...(comparativo.keywords_analise.sugeridas_adicionar || [])
      ];
      updates.keywords = [...new Set(novasKeywords)];
    }

    if (Object.keys(updates).length === 0) {
      toast.error('Nenhuma otimização para aplicar');
      return;
    }

    onAplicar(updates);
    toast.success(`${Object.keys(updates).length} otimizações aplicadas!`);
  };

  const getPrioridadeColor = (prioridade) => {
    if (prioridade?.toLowerCase() === 'alta') return 'bg-red-100 text-red-800';
    if (prioridade?.toLowerCase() === 'média') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Otimizador Avançado com Comparativo</h3>
        <Button
          onClick={analisar}
          disabled={otimizando}
          size="sm"
        >
          {otimizando ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analisando...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" />Analisar SEO</>
          )}
        </Button>
      </div>

      {comparativo && (
        <div className="space-y-4">
          {/* Score Geral + Aplicar Todas */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Score SEO Estimado</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-400">{artigo.score_seo_atual || 0}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-2xl font-bold text-green-600">{comparativo.score_geral_estimado}</span>
                  <Badge className="bg-green-600 text-white">
                    +{comparativo.score_geral_estimado - (artigo.score_seo_atual || 0)} pontos
                  </Badge>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <Button
              onClick={aplicarTodas}
              size="sm"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Aplicar Todas Otimizações
            </Button>
          </div>

          {/* Título */}
          {comparativo.titulo_analise && (
            <div className="border border-blue-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm">Título</h4>
                <Badge className={getPrioridadeColor(comparativo.titulo_analise.prioridade)}>
                  {comparativo.titulo_analise.prioridade}
                </Badge>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600 font-medium">❌ Atual ({comparativo.titulo_analise.score_antes}/100):</p>
                  <p className="text-gray-800">{comparativo.titulo_analise.atual}</p>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <p className="text-green-600 font-medium">✅ Otimizado ({comparativo.titulo_analise.score_depois}/100):</p>
                  <p className="text-gray-800">{comparativo.titulo_analise.otimizado}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs">
                <p className="font-medium text-blue-900 mb-1">💡 Justificativa:</p>
                <p className="text-gray-700">{comparativo.titulo_analise.justificativa}</p>
              </div>

              <div className="bg-purple-50 p-2 rounded text-xs">
                <p className="font-medium text-purple-900 mb-1">📊 Impacto Esperado:</p>
                <p className="text-gray-700">{comparativo.titulo_analise.impacto_estimado}</p>
              </div>

              <Button
                size="sm"
                onClick={() => aplicarOtimizacao('titulo')}
                className="w-full"
              >
                <Check className="w-3 h-3 mr-1" />
                Aplicar Título Otimizado
              </Button>
            </div>
          )}

          {/* Meta Description */}
          {comparativo.meta_analise && (
            <div className="border border-green-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm">Meta Description</h4>
                <Badge className={getPrioridadeColor(comparativo.meta_analise.prioridade)}>
                  {comparativo.meta_analise.prioridade}
                </Badge>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600 font-medium">❌ Atual ({comparativo.meta_analise.score_antes}/100):</p>
                  <p className="text-gray-800">{comparativo.meta_analise.atual || 'Não definida'}</p>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <p className="text-green-600 font-medium">✅ Otimizado ({comparativo.meta_analise.score_depois}/100):</p>
                  <p className="text-gray-800">{comparativo.meta_analise.otimizado}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs">
                <p className="font-medium text-blue-900 mb-1">💡 Justificativa:</p>
                <p className="text-gray-700">{comparativo.meta_analise.justificativa}</p>
              </div>

              <div className="bg-purple-50 p-2 rounded text-xs">
                <p className="font-medium text-purple-900 mb-1">📊 Impacto Esperado:</p>
                <p className="text-gray-700">{comparativo.meta_analise.impacto_estimado}</p>
              </div>

              <Button
                size="sm"
                onClick={() => aplicarOtimizacao('meta')}
                className="w-full"
                variant="outline"
              >
                <Check className="w-3 h-3 mr-1" />
                Aplicar Meta Otimizada
              </Button>
            </div>
          )}

          {/* Keywords */}
          {comparativo.keywords_analise && (
            <div className="border border-yellow-200 rounded-lg p-3 space-y-2">
              <h4 className="font-bold text-sm">Estratégia de Keywords</h4>
              
              <div className="bg-blue-50 p-2 rounded text-xs">
                <p className="font-medium text-blue-900 mb-1">💡 Análise:</p>
                <p className="text-gray-700">{comparativo.keywords_analise.justificativa}</p>
              </div>

              {comparativo.keywords_analise.sugeridas_adicionar?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">✅ Adicionar:</p>
                  <div className="flex flex-wrap gap-1">
                    {comparativo.keywords_analise.sugeridas_adicionar.map((kw, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="text-xs bg-green-50 border-green-300 cursor-pointer hover:bg-green-100"
                        onClick={() => aplicarKeywordIndividual(kw)}
                      >
                        +{kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {comparativo.keywords_analise.sugeridas_remover?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-red-700 mb-1">❌ Remover:</p>
                  <div className="flex flex-wrap gap-1">
                    {comparativo.keywords_analise.sugeridas_remover.map((kw, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="text-xs bg-red-50 border-red-300 cursor-pointer hover:bg-red-100"
                        onClick={() => removerKeywordIndividual(kw)}
                      >
                        -{kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {comparativo.keywords_analise.gaps_oportunidade?.length > 0 && (
                <div className="bg-purple-50 p-2 rounded text-xs">
                  <p className="font-medium text-purple-900 mb-1">🎯 Gaps de Oportunidade:</p>
                  <ul className="space-y-1">
                    {comparativo.keywords_analise.gaps_oportunidade.map((gap, i) => (
                      <li key={i} className="text-gray-700">• {gap}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                size="sm"
                onClick={() => aplicarOtimizacao('keywords')}
                className="w-full"
                variant="outline"
              >
                <Check className="w-3 h-3 mr-1" />
                Aplicar Keywords Otimizadas
              </Button>
            </div>
          )}

          {/* Melhorias Estrutura */}
          {comparativo.melhorias_estrutura?.length > 0 && (
            <div className="border border-purple-200 rounded-lg p-3">
              <h4 className="font-bold text-sm mb-2">Melhorias de Estrutura</h4>
              <div className="space-y-2">
                {comparativo.melhorias_estrutura.map((melhoria, i) => (
                  <div key={i} className="p-2 bg-purple-50 rounded text-xs">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-purple-900">{melhoria.tipo}</p>
                      {melhoria.aplicavel_automaticamente && (
                        <Badge className="bg-green-600 text-white text-xs">Auto</Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-1">{melhoria.descricao}</p>
                    <p className="text-purple-600 text-xs">📊 {melhoria.impacto}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}