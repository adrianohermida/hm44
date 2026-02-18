import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp, Sparkles, Loader2, CheckCircle2, AlertTriangle, X, Check, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function OtimizadorConteudo({ artigo }) {
  const [analise, setAnalise] = useState(null);
  const [progresso, setProgresso] = useState({ etapa: "", percentual: 0 });
  const [aprovacoes, setAprovacoes] = useState({});
  const [autoApprove, setAutoApprove] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const queryClient = useQueryClient();

  const analisarMutation = useMutation({
    mutationFn: async () => {
      setProgresso({ etapa: "Auditoria SEO...", percentual: 15 });
      await new Promise(r => setTimeout(r, 300));
      
      setProgresso({ etapa: "Analisando estrutura e links...", percentual: 30 });
      await new Promise(r => setTimeout(r, 300));
      
      setProgresso({ etapa: "Verificando meta tags...", percentual: 50 });
      await new Promise(r => setTimeout(r, 300));
      
      setProgresso({ etapa: "Comparando concorrentes...", percentual: 70 });
      await new Promise(r => setTimeout(r, 300));
      
      setProgresso({ etapa: "Gerando reescrita otimizada...", percentual: 85 });

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `AUDITORIA SEO AVANÇADA + REESCRITA OTIMIZADA

ARTIGO ORIGINAL:
Título: ${artigo.titulo}
Meta: ${artigo.meta_description || 'AUSENTE'}
Keywords: ${artigo.keywords?.join(', ') || 'NENHUMA'}
Conteúdo (primeiros 2000 chars):
${artigo.conteudo?.substring(0, 2000)}

OBJETIVOS:
1. Melhorar ranking orgânico (Google Brasil).
2. Aumentar CTR em SERP (meta + título).
3. Garantir escaneabilidade (H2/H3, listas, exemplos).
4. Reforçar autoridade no nicho (Direito do Consumidor).
5. Adaptar linguagem: acessível, clara, mas com autoridade.

AUDITORIA TÉCNICA (detalhar com métricas):
- Estrutura H2/H3: hierarquia, densidade de keywords, clareza.
- Links internos: relevância, quantidade, contexto.
- Links externos: autoridade, status (quebrados ou não).
- Velocidade leitura: word count, tempo médio leitura.
- Meta tags: tamanho, presença de keywords, potencial CTR.
- Concorrência: comparar com top 3 resultados atuais para keyword principal.

REESCRITA OBRIGATÓRIA:
1. Novo título (55–65 chars, keyword no início, incluir número/ano, promessa clara).
2. Nova meta description (145–155 chars, CTA forte, benefício direto, urgência).
3. Introdução reescrita (100–120 palavras, hook emocional + estatística real).
4. Adicionar 3 H2 com keywords LSI (sem repetição exata).
5. Reescrever primeira seção (200 palavras, formato lista, exemplos práticos).
6. Sugerir 2 links internos e 1 externo de autoridade.

DIFERENÇAS ESPECÍFICAS:
- Mostrar antes → depois para cada mudança.
- Justificar cada alteração (SEO, legibilidade, conversão).
- Classificar impacto esperado: baixo, médio, alto.

CONTEXTUALIZAÇÃO:
- Nicho: Direito do Consumidor Brasil
- Público: endividados 25–55 anos
- Tom: acessível, empático, mas com autoridade`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            auditoria: {
              type: "object",
              properties: {
                estrutura_h2h3: { type: "object", properties: { score: { type: "number" }, problemas: { type: "array", items: { type: "string" } } } },
                links_internos: { type: "object", properties: { quantidade: { type: "number" }, problemas: { type: "array", items: { type: "string" } } } },
                links_externos: { type: "object", properties: { quantidade: { type: "number" }, quebrados: { type: "number" } } },
                velocidade_leitura: { type: "object", properties: { word_count: { type: "number" }, tempo_min: { type: "number" } } },
                meta_tags: { type: "object", properties: { score: { type: "number" }, issues: { type: "array", items: { type: "string" } } } }
              }
            },
            score_atual: { type: "number" },
            score_projetado: { type: "number" },
            posicao_atual: { type: "string" },
            posicao_projetada: { type: "string" },
            volume_busca_mensal: { type: "number" },
            dificuldade_ranking: { type: "number" },
            mudancas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipo: { type: "string" },
                  antes: { type: "string" },
                  depois: { type: "string" },
                  motivo: { type: "string" },
                  impacto_seo: { type: "string" }
                }
              }
            },
            keywords_lsi: { type: "array", items: { type: "string" } },
            aumento_trafego_percentual: { type: "number" },
            links_sugeridos: {
              type: "object",
              properties: {
                internos: { type: "array", items: { type: "string" } },
                externos: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      });
      
      setProgresso({ etapa: "Concluído!", percentual: 100 });
      return response;
    },
    onSuccess: (data) => {
      setAnalise(data);
      const initialAprovacoes = {};
      data.mudancas.forEach((m, i) => {
        initialAprovacoes[i] = autoApprove;
      });
      setAprovacoes(initialAprovacoes);
      toast.success("Análise completa!");
      setTimeout(() => setProgresso({ etapa: "", percentual: 0 }), 2000);
    }
  });

  const aplicarMutation = useMutation({
    mutationFn: async () => {
      const mudancasAprovadas = analise.mudancas.filter((_, i) => aprovacoes[i]);
      
      let novoConteudo = artigo.conteudo;
      let novoTitulo = artigo.titulo;
      let novaMeta = artigo.meta_description;
      
      mudancasAprovadas.forEach(m => {
        if (m.tipo === 'titulo') novoTitulo = m.depois;
        if (m.tipo === 'meta_description') novaMeta = m.depois;
        if (m.tipo === 'introducao' || m.tipo === 'secao') {
          novoConteudo = novoConteudo.replace(m.antes, m.depois);
        }
      });

      const updates = {
        titulo: novoTitulo,
        meta_description: novaMeta,
        conteudo: novoConteudo,
        keywords: [...new Set([...(artigo.keywords || []), ...analise.keywords_lsi.slice(0, 5)])]
      };
      
      await base44.entities.Blog.update(artigo.id, updates);
      return { mudancas: mudancasAprovadas.length };
    },
    onSuccess: ({ mudancas }) => {
      queryClient.invalidateQueries(['blog-artigos', 'blog-otimizacao']);
      toast.success(`${mudancas} otimizações aplicadas!`);
      setAnalise(null);
      setAprovacoes({});
    }
  });

  const toggleAprovacao = (index) => {
    setAprovacoes(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const aprovarTodas = () => {
    const todas = {};
    analise.mudancas.forEach((_, i) => todas[i] = true);
    setAprovacoes(todas);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Otimização Contínua
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoApprove}
              onCheckedChange={setAutoApprove}
              id="auto-approve"
            />
            <Label htmlFor="auto-approve" className="text-sm cursor-pointer">
              Aprovar automaticamente
            </Label>
          </div>
          <Button
            onClick={() => analisarMutation.mutate()}
            disabled={analisarMutation.isPending}
            size="sm"
          >
            {analisarMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analisando...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" />Analisar SEO</>
            )}
          </Button>
        </div>
      </div>

      {progresso.percentual > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">{progresso.etapa}</span>
            <span className="font-semibold">{progresso.percentual}%</span>
          </div>
          <Progress value={progresso.percentual} className="h-2" />
        </div>
      )}

      {analise && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-gray-600 mb-1">Score Atual</p>
              <p className="text-2xl font-bold text-red-600">{analise.score_atual}/100</p>
              <p className="text-xs text-gray-500">Posição: {analise.posicao_atual}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 mb-1">Score Projetado</p>
              <p className="text-2xl font-bold text-green-600">{analise.score_projetado}/100</p>
              <p className="text-xs text-gray-500">Posição: {analise.posicao_projetada}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Volume Busca</p>
              <p className="text-2xl font-bold text-blue-600">{analise.volume_busca_mensal}</p>
              <p className="text-xs text-gray-500">buscas/mês</p>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm font-semibold mb-2">Auditoria Técnica</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>H2/H3 Score: <strong>{analise.auditoria.estrutura_h2h3.score}/100</strong></div>
              <div>Links Internos: <strong>{analise.auditoria.links_internos.quantidade}</strong></div>
              <div>Links Quebrados: <strong className="text-red-600">{analise.auditoria.links_externos.quebrados}</strong></div>
              <div>Tempo Leitura: <strong>{analise.auditoria.velocidade_leitura.tempo_min} min</strong></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Mudanças Propostas ({analise.mudancas.length})</h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowDiff(!showDiff)}>
                <Eye className="w-4 h-4 mr-2" />
                {showDiff ? 'Ocultar Diff' : 'Ver Comparação'}
              </Button>
              <Button size="sm" variant="outline" onClick={aprovarTodas}>
                Aprovar Todas
              </Button>
            </div>
          </div>

          <ScrollArea className="max-h-96 border rounded-lg">
            <div className="p-4 space-y-3">
              {analise.mudancas.map((mudanca, i) => (
                <div key={i} className={`border rounded-lg p-3 ${aprovacoes[i] ? 'bg-green-50 border-green-300' : 'bg-white'}`}>
                  <div className="flex items-start gap-3">
                    <Button
                      size="sm"
                      variant={aprovacoes[i] ? "default" : "outline"}
                      onClick={() => toggleAprovacao(i)}
                      className="mt-1"
                    >
                      {aprovacoes[i] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">{mudanca.tipo.replace('_', ' ')}</Badge>
                        <Badge className="bg-blue-100 text-blue-800">{mudanca.impacto_seo}</Badge>
                      </div>
                      
                      {showDiff ? (
                        <div className="space-y-2">
                          <div className="p-2 bg-red-50 rounded border border-red-200">
                            <p className="text-xs font-semibold text-red-700 mb-1">Antes:</p>
                            <p className="text-sm text-gray-700">{mudanca.antes}</p>
                          </div>
                          <div className="p-2 bg-green-50 rounded border border-green-200">
                            <p className="text-xs font-semibold text-green-700 mb-1">Depois:</p>
                            <p className="text-sm text-gray-700">{mudanca.depois}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700 mb-2">{mudanca.depois}</p>
                      )}
                      
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Motivo:</strong> {mudanca.motivo}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {analise.links_sugeridos && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-semibold mb-2">Links Sugeridos</p>
              <div className="space-y-2 text-xs">
                {analise.links_sugeridos.internos?.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700">Internos:</p>
                    <ul className="ml-4 list-disc">
                      {analise.links_sugeridos.internos.map((link, i) => (
                        <li key={i} className="text-gray-600">{link}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analise.links_sugeridos.externos?.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700">Externos (autoridade):</p>
                    <ul className="ml-4 list-disc">
                      {analise.links_sugeridos.externos.map((link, i) => (
                        <li key={i} className="text-gray-600">{link}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Impacto Estimado: +{analise.aumento_trafego_percentual}% tráfego
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {Object.values(aprovacoes).filter(Boolean).length} de {analise.mudancas.length} mudanças aprovadas
            </p>
          </div>

          <Button
            onClick={() => aplicarMutation.mutate()}
            disabled={aplicarMutation.isPending || Object.values(aprovacoes).filter(Boolean).length === 0}
            className="w-full bg-green-600"
          >
            {aplicarMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Aplicando...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4 mr-2" />Aplicar {Object.values(aprovacoes).filter(Boolean).length} Otimizações</>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}