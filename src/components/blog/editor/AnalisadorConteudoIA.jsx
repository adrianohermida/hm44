import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AnalisadorConteudoIA({ artigo, onAplicarMelhorias }) {
  const [analisando, setAnalisando] = useState(false);
  const [analise, setAnalise] = useState(null);

  const aplicarOtimizacoes = async () => {
    if (!analise) {
      toast.error('Execute análise primeiro');
      return;
    }

    try {
      toast.loading('Aplicando otimizações...');
      
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Com base na análise, gere CORREÇÕES ESPECÍFICAS (não novos artigos):

ARTIGO ATUAL:
${JSON.stringify(artigo, null, 2)}

PROBLEMAS DETECTADOS:
${[...analise.qualidade.problemas, ...analise.seo.problemas].join('\n')}

GERE:
1. titulo_otimizado (se score < 80): corrigir título existente
2. meta_otimizada (se ausente/ruim): gerar meta description
3. keywords_sugeridas (se < 3): sugerir 5-7 keywords
4. topicos_corrigidos: MANTER estrutura atual, apenas MELHORAR textos dos H2/H3/parágrafos problemáticos

NÃO crie artigos novos, apenas CORRIJA o existente.`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo_otimizado: { type: "string" },
            meta_otimizada: { type: "string" },
            keywords_sugeridas: { type: "array", items: { type: "string" } },
            topicos_corrigidos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  tipo: { type: "string" },
                  texto: { type: "string" }
                }
              }
            }
          }
        }
      });

      const melhorias = {};
      if (resultado.titulo_otimizado && resultado.titulo_otimizado !== artigo.titulo) {
        melhorias.titulo = resultado.titulo_otimizado;
      }
      if (resultado.meta_otimizada) {
        melhorias.meta_description = resultado.meta_otimizada;
      }
      if (resultado.keywords_sugeridas?.length > 0) {
        melhorias.keywords = resultado.keywords_sugeridas;
      }
      if (resultado.topicos_corrigidos?.length > 0) {
        melhorias.topicos = resultado.topicos_corrigidos;
      }

      if (Object.keys(melhorias).length === 0) {
        toast.error('Nenhuma melhoria aplicável');
        return;
      }

      onAplicarMelhorias(melhorias);
      toast.success(`${Object.keys(melhorias).length} otimizações aplicadas!`);
    } catch (error) {
      toast.error('Erro ao aplicar otimizações');
    }
  };

  const analisar = async () => {
    setAnalisando(true);
    try {
      const conteudoCompleto = artigo.topicos.map(t => t.texto || '').join('\n\n');
      const palavrasTotal = conteudoCompleto.split(/\s+/).length;

      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `ANÁLISE PROFUNDA DE CONTEÚDO JURÍDICO:

TÍTULO: "${artigo.titulo}"
META: "${artigo.meta_description || 'AUSENTE'}"
KEYWORDS: ${artigo.keywords?.join(', ') || 'NENHUMA'}
PALAVRAS: ${palavrasTotal}

CONTEÚDO:
${conteudoCompleto.slice(0, 3000)}

AVALIAÇÃO COMPLETA (0-100 cada):

1. QUALIDADE GERAL
   - Profundidade técnica
   - Estrutura lógica
   - Argumentação fundamentada
   - Exemplos práticos
   - Valor para leitor

2. SEO SCORE
   - Densidade keywords (1-3% ideal)
   - Uso keywords no título/H2
   - Meta description otimizada
   - Estrutura H2/H3 adequada
   - Links internos/externos

3. LEGIBILIDADE (Flesch)
   - Sentenças curtas (15-20 palavras)
   - Parágrafos concisos
   - Vocabulário acessível
   - Transições claras
   - Voz ativa predominante

4. ORIGINALIDADE
   - Frases únicas
   - Evita clichês jurídicos
   - Perspectiva inovadora
   - Citações corretas
   - Risco plágio (0=nenhum, 100=alto)

Para CADA categoria:
- Score (0-100)
- Pontos fortes (2-3)
- Problemas críticos (2-3 com localização)
- Ações específicas (melhorias aplicáveis)

DENSIDADE KEYWORDS:
- Keyword principal: contagem + % + ideal?
- Keywords secundárias: distribuição

COMPLEXIDADE SENTENÇAS:
- Média palavras/sentença
- Sentenças >25 palavras (problemáticas)
- Sugestões simplificação

RISCOS PLÁGIO:
- Frases suspeitas (muito genéricas/comuns)
- Sugestão reescrita única`,
        response_json_schema: {
          type: "object",
          properties: {
            scores: {
              type: "object",
              properties: {
                qualidade: { type: "number" },
                seo: { type: "number" },
                legibilidade: { type: "number" },
                originalidade: { type: "number" },
                geral: { type: "number" }
              }
            },
            qualidade: {
              type: "object",
              properties: {
                pontos_fortes: { type: "array", items: { type: "string" } },
                problemas: { type: "array", items: { type: "string" } },
                acoes: { type: "array", items: { type: "string" } }
              }
            },
            seo: {
              type: "object",
              properties: {
                pontos_fortes: { type: "array", items: { type: "string" } },
                problemas: { type: "array", items: { type: "string" } },
                acoes: { type: "array", items: { type: "string" } }
              }
            },
            legibilidade: {
              type: "object",
              properties: {
                media_palavras_sentenca: { type: "number" },
                sentencas_complexas: { type: "array", items: { type: "string" } },
                acoes: { type: "array", items: { type: "string" } }
              }
            },
            originalidade: {
              type: "object",
              properties: {
                risco_plagio: { type: "number" },
                frases_suspeitas: { type: "array", items: { type: "string" } },
                acoes: { type: "array", items: { type: "string" } }
              }
            },
            densidade_keywords: {
              type: "object",
              properties: {
                principal: { type: "string" },
                percentual: { type: "number" },
                ideal: { type: "boolean" }
              }
            }
          }
        }
      });

      setAnalise(resultado);
      toast.success('Análise concluída!');
    } catch (error) {
      toast.error('Erro ao analisar conteúdo');
    } finally {
      setAnalisando(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    return 'Precisa melhorar';
  };

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Análise IA Completa
          </span>
          {analise && (
            <Badge className={`${getScoreColor(analise.scores.geral)} text-white`}>
              {analise.scores.geral}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={analisar} 
          disabled={analisando}
          className="w-full"
          size="sm"
        >
          {analisando ? (
            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3 mr-2" />
          )}
          {analisando ? 'Analisando...' : 'Analisar Conteúdo'}
        </Button>

        {analise && (
          <div className="space-y-4">
            {/* Scores Overview */}
            <div className="grid grid-cols-2 gap-2">
              <ScoreCard label="Qualidade" score={analise.scores.qualidade} />
              <ScoreCard label="SEO" score={analise.scores.seo} />
              <ScoreCard label="Legibilidade" score={analise.scores.legibilidade} />
              <ScoreCard label="Originalidade" score={analise.scores.originalidade} />
            </div>

            {/* Densidade Keywords */}
            {analise.densidade_keywords && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs font-semibold mb-1">Densidade Keyword</p>
                <p className="text-xs">
                  <span className="font-bold">{analise.densidade_keywords.percentual}%</span>
                  {' '}({analise.densidade_keywords.principal})
                  {analise.densidade_keywords.ideal ? (
                    <CheckCircle className="w-3 h-3 inline ml-1 text-green-600" />
                  ) : (
                    <AlertCircle className="w-3 h-3 inline ml-1 text-orange-600" />
                  )}
                </p>
              </div>
            )}

            {/* Legibilidade */}
            {analise.legibilidade && (
              <div className="p-3 bg-purple-50 rounded border border-purple-200">
                <p className="text-xs font-semibold mb-2">Complexidade Sentenças</p>
                <p className="text-xs mb-2">
                  Média: <span className="font-bold">{analise.legibilidade.media_palavras_sentenca}</span> palavras/sentença
                </p>
                {analise.legibilidade.sentencas_complexas?.length > 0 && (
                  <>
                    <p className="text-xs text-orange-600 mb-1">
                      {analise.legibilidade.sentencas_complexas.length} sentenças complexas:
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {analise.legibilidade.sentencas_complexas.slice(0, 3).map((s, i) => (
                        <p key={i} className="text-xs text-gray-600 italic">• {s.slice(0, 80)}...</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Originalidade / Plágio */}
            {analise.originalidade && analise.originalidade.risco_plagio > 20 && (
              <div className="p-3 bg-red-50 rounded border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <p className="text-xs font-semibold text-red-800">
                    Risco Plágio: {analise.originalidade.risco_plagio}%
                  </p>
                </div>
                {analise.originalidade.frases_suspeitas?.length > 0 && (
                  <div className="space-y-1">
                    {analise.originalidade.frases_suspeitas.slice(0, 2).map((f, i) => (
                      <p key={i} className="text-xs text-gray-600">• {f}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ações Recomendadas */}
            <div className="space-y-2">
              <p className="text-xs font-semibold">Ações Prioritárias:</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {[...analise.qualidade.acoes, ...analise.seo.acoes, ...analise.legibilidade.acoes]
                  .slice(0, 8)
                  .map((acao, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{acao}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Aplicar Otimizações */}
            {analise.scores.geral < 80 && (
              <Button 
                onClick={() => aplicarOtimizacoes()}
                size="sm" 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Aplicar Otimizações Automáticas
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreCard({ label, score }) {
  const getColor = (s) => {
    if (s >= 80) return 'border-green-500 bg-green-50';
    if (s >= 60) return 'border-yellow-500 bg-yellow-50';
    return 'border-red-500 bg-red-50';
  };

  return (
    <div className={`p-2 rounded border ${getColor(score)}`}>
      <p className="text-xs text-gray-600">{label}</p>
      <p className="text-lg font-bold">{score}</p>
    </div>
  );
}