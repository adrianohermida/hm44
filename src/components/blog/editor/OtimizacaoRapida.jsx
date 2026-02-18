import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, Sparkles, Check, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function OtimizacaoRapida({ artigo, onAplicar }) {
  const [otimizando, setOtimizando] = useState(false);
  const [sugestoes, setSugestoes] = useState(null);
  const [selecoes, setSelecoes] = useState({
    titulo: true,
    meta: true,
    keywords: true,
    estrutura: true,
    legibilidade: true,
    conteudo: true,
    citacoes: true,
    referencias: true,
    links_internos: true,
    tom: true
  });

  const executarOtimizacao = async () => {
    setOtimizando(true);
    try {
      const conteudo = artigo.topicos.map(t => t.texto || t.itens?.join(' ') || '').join('\n');
      
      const artigosExistentes = await base44.entities.Blog.filter({
        escritorio_id: artigo.escritorio_id,
        publicado: true
      });
      
      const artigosParaLinks = artigosExistentes
        .filter(a => a.id !== artigo.id)
        .map(a => ({ id: a.id, titulo: a.titulo, slug: a.slug, keywords: a.keywords }))
        .slice(0, 20);
      
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `OTIMIZAÇÃO COMPLETA - SEO + Conteúdo Enriquecido + Referências

ARTIGO ATUAL:
Título: "${artigo.titulo}"
Meta: "${artigo.meta_description || 'não definida'}"
Keywords: ${artigo.keywords?.join(', ') || 'nenhuma'}
Score Atual: ${artigo.score_seo_atual || 0}/100
Conteúdo: ${conteudo.substring(0, 2000)}

ARTIGOS RELACIONADOS DISPONÍVEIS:
${artigosParaLinks.map(a => `- "${a.titulo}" (slug: ${a.slug}, keywords: ${a.keywords?.join(', ')})`).join('\n')}

OTIMIZAÇÕES OBRIGATÓRIAS:

1. TÍTULO (50-65 chars, palavra-chave início, CTR >5%)
2. META DESCRIPTION (150-160 chars, benefício + CTA)
3. KEYWORDS (5-7 keywords, long-tail + LSI)
4. ESTRUTURA H2/H3 (SEO-friendly + lógica)
5. LEGIBILIDADE (frases <20 palavras)

6. EXPANSÃO DE CONTEÚDO AVANÇADA:
   Para CADA parágrafo curto (<150 palavras):
   - Adicionar CASOS DE ESTUDO reais e específicos (ex: "João Silva reduziu 80% de suas dívidas em 6 meses usando...")
   - Incluir DADOS ESTATÍSTICOS verificáveis (ex: "Segundo IBGE 2024, 67% dos brasileiros...")
   - Inserir EXEMPLOS PRÁTICOS passo-a-passo
   - Criar ANALOGIAS simples para termos complexos
   - Adicionar ALERTAS/DICAS em destaque
   
7. CITAÇÕES JURÍDICAS:
   - Legislação com artigos específicos
   - Jurisprudências com número/ano
   - Doutrinas com autor reconhecido
   - Formato: **[Tipo]**: Texto - *Fonte: [URL]*

8. LINKS INTERNOS AUTOMÁTICOS:
   Analise o conteúdo e identifique onde inserir links naturais para os artigos relacionados disponíveis:
   - Contexto relevante (não forçado)
   - Anchor text otimizado (não "clique aqui")
   - Posição estratégica no fluxo de leitura
   - Retorne: índice do tópico, texto do anchor, slug do artigo

9. TOM DE VOZ ADAPTADO:
   Analise o público-alvo (superendividados, consumidores leigos) e:
   - Nível de formalidade ideal (semi-formal jurídico acessível)
   - Uso de "você" vs "o consumidor"
   - Equilíbrio técnico-acessível
   - Empatia e urgência apropriadas
   Retorne ajustes de tom por tópico se necessário

10. REFERÊNCIAS COMPLETAS:
   - Lista estruturada de todas as fontes
   - URLs válidas de consulta
   - Data de acesso
   - Tipo (legislação/jurisprudência/doutrina)

Retorne JSON completo e aplicável IMEDIATAMENTE.`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: {
              type: "object",
              properties: {
                atual: { type: "string" },
                otimizado: { type: "string" },
                score_antes: { type: "number" },
                score_depois: { type: "number" },
                justificativa: { type: "string" }
              }
            },
            meta: {
              type: "object",
              properties: {
                atual: { type: "string" },
                otimizado: { type: "string" },
                score_antes: { type: "number" },
                score_depois: { type: "number" },
                justificativa: { type: "string" }
              }
            },
            keywords: {
              type: "object",
              properties: {
                atuais: { type: "array", items: { type: "string" } },
                otimizadas: { type: "array", items: { type: "string" } },
                justificativa: { type: "string" }
              }
            },
            estrutura_h2_sugerida: {
              type: "array",
              items: { type: "string" }
            },
            topicos_legibilidade: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  indice: { type: "number" },
                  texto_otimizado: { type: "string" }
                }
              }
            },
            desenvolvimento_conteudo: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  indice: { type: "number" },
                  tipo_topico: { type: "string" },
                  conteudo_expandido: { type: "string" },
                  justificativa: { type: "string" },
                  caso_estudo_incluido: { type: "boolean" },
                  dados_estatisticos_incluidos: { type: "boolean" }
                }
              }
            },
            links_internos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  indice_topico: { type: "number" },
                  anchor_text: { type: "string" },
                  slug_artigo: { type: "string" },
                  titulo_artigo: { type: "string" },
                  contexto: { type: "string" }
                }
              }
            },
            ajustes_tom: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  indice: { type: "number" },
                  texto_ajustado: { type: "string" },
                  mudanca_aplicada: { type: "string" }
                }
              }
            },
            citacoes_juridicas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipo: { type: "string" },
                  texto_citacao: { type: "string" },
                  fonte: { type: "string" },
                  posicao_sugerida: { type: "number" }
                }
              }
            },
            referencias_geradas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  url: { type: "string" },
                  tipo: { type: "string" },
                  data_acesso: { type: "string" }
                }
              }
            },
            score_final_estimado: { type: "number" }
          }
        }
      });

      setSugestoes(resultado);
      toast.success(`Score estimado: ${resultado.score_final_estimado}/100!`);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro na otimização');
    } finally {
      setOtimizando(false);
    }
  };

  const aplicarSelecionadas = () => {
    if (!sugestoes) return;

    const updates = {};
    let aplicados = 0;
    
    if (selecoes.titulo && sugestoes.titulo?.otimizado) {
      updates.titulo = sugestoes.titulo.otimizado;
      aplicados++;
    }
    
    if (selecoes.meta && sugestoes.meta?.otimizado) {
      updates.meta_description = sugestoes.meta.otimizado;
      aplicados++;
    }
    
    if (selecoes.keywords && sugestoes.keywords?.otimizadas) {
      updates.keywords = sugestoes.keywords.otimizadas;
      aplicados++;
    }

    if (selecoes.estrutura && sugestoes.estrutura_h2_sugerida?.length > 0) {
      const topicosExistentes = artigo.topicos || [];
      const novosTopicos = sugestoes.estrutura_h2_sugerida.map((h2, i) => ({
        id: Date.now() + i * 100,
        tipo: 'h2',
        texto: h2
      }));
      
      // Mesclar: novos H2s + tópicos existentes (sem duplicar)
      const topicosExistentesTextos = topicosExistentes.map(t => t.texto?.toLowerCase());
      const topicosNaoExistentes = novosTopicos.filter(
        novo => !topicosExistentesTextos.includes(novo.texto.toLowerCase())
      );
      
      updates.topicos = [...topicosNaoExistentes, ...topicosExistentes];
      aplicados++;
    }

    if (selecoes.legibilidade && sugestoes.topicos_legibilidade?.length > 0) {
      let topicosAtualizados = updates.topicos || artigo.topicos || [];
      topicosAtualizados = topicosAtualizados.map(t => ({ ...t }));
      
      sugestoes.topicos_legibilidade.forEach(otim => {
        const indice = otim.indice;
        if (topicosAtualizados[indice]) {
          topicosAtualizados[indice] = {
            ...topicosAtualizados[indice],
            texto: otim.texto_otimizado
          };
        }
      });
      
      updates.topicos = topicosAtualizados;
      aplicados++;
    }

    if (selecoes.conteudo && sugestoes.desenvolvimento_conteudo?.length > 0) {
      let topicosAtualizados = updates.topicos || artigo.topicos || [];
      topicosAtualizados = topicosAtualizados.map(t => ({ ...t }));
      
      sugestoes.desenvolvimento_conteudo.forEach(dev => {
        const indice = dev.indice;
        if (topicosAtualizados[indice]) {
          if (dev.tipo_topico === 'lista') {
            topicosAtualizados[indice] = {
              ...topicosAtualizados[indice],
              tipo: 'lista',
              itens: dev.conteudo_expandido.split('\n').filter(i => i.trim())
            };
          } else if (dev.paragrafos_multiplos) {
            // Se expandiu para múltiplos parágrafos, insere após o original
            const novosParas = dev.paragrafos_multiplos.map(p => ({
              id: Date.now() + Math.random(),
              tipo: 'paragrafo',
              texto: p
            }));
            topicosAtualizados.splice(indice + 1, 0, ...novosParas);
          } else {
            topicosAtualizados[indice] = {
              ...topicosAtualizados[indice],
              texto: dev.conteudo_expandido
            };
          }
        }
      });
      
      updates.topicos = topicosAtualizados;
      aplicados++;
    }

    if (selecoes.citacoes && sugestoes.citacoes_juridicas?.length > 0) {
      let topicosAtualizados = updates.topicos || artigo.topicos || [];
      topicosAtualizados = [...topicosAtualizados];
      
      sugestoes.citacoes_juridicas.forEach(citacao => {
        const novaCitacao = {
          id: Date.now() + Math.random(),
          tipo: 'paragrafo',
          texto: `**${citacao.tipo}**: ${citacao.texto_citacao}\n\n*Fonte: ${citacao.fonte}*`
        };
        
        if (citacao.posicao_sugerida >= 0 && citacao.posicao_sugerida < topicosAtualizados.length) {
          topicosAtualizados.splice(citacao.posicao_sugerida + 1, 0, novaCitacao);
        } else {
          topicosAtualizados.push(novaCitacao);
        }
      });
      
      updates.topicos = topicosAtualizados;
      aplicados++;
    }

    if (selecoes.referencias && sugestoes.referencias_geradas?.length > 0) {
      updates.referencias = sugestoes.referencias_geradas.map(ref => ({
        titulo: ref.titulo,
        url: ref.url,
        tipo: ref.tipo || 'legislacao',
        data_acesso: ref.data_acesso || new Date().toISOString()
      }));
      aplicados++;
    }

    if (selecoes.links_internos && sugestoes.links_internos?.length > 0) {
      let topicosAtualizados = updates.topicos || artigo.topicos || [];
      topicosAtualizados = topicosAtualizados.map(t => ({ ...t }));
      
      sugestoes.links_internos.forEach(link => {
        const indice = link.indice_topico;
        if (topicosAtualizados[indice]) {
          const textoAtual = topicosAtualizados[indice].texto || '';
          const linkMarkdown = `[${link.anchor_text}](/BlogPost/${link.slug_artigo})`;
          const textoComLink = textoAtual + `\n\n${link.contexto} ${linkMarkdown}`;
          
          topicosAtualizados[indice] = {
            ...topicosAtualizados[indice],
            texto: textoComLink
          };
        }
      });
      
      updates.topicos = topicosAtualizados;
      aplicados++;
    }

    if (selecoes.tom && sugestoes.ajustes_tom?.length > 0) {
      let topicosAtualizados = updates.topicos || artigo.topicos || [];
      topicosAtualizados = topicosAtualizados.map(t => ({ ...t }));
      
      sugestoes.ajustes_tom.forEach(ajuste => {
        const indice = ajuste.indice;
        if (topicosAtualizados[indice]) {
          topicosAtualizados[indice] = {
            ...topicosAtualizados[indice],
            texto: ajuste.texto_ajustado
          };
        }
      });
      
      updates.topicos = topicosAtualizados;
      aplicados++;
    }

    if (aplicados === 0) {
      toast.error('Selecione pelo menos uma otimização');
      return;
    }

    onAplicar(updates);
    setSugestoes(null);
    toast.success(`${aplicados} otimizações aplicadas! Revise e salve.`);
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-orange-900">Otimização Rápida (1-Click)</h3>
        </div>
        <Button onClick={executarOtimizacao} disabled={otimizando}>
          <Sparkles className={`w-4 h-4 mr-2 ${otimizando ? 'animate-pulse' : ''}`} />
          {otimizando ? 'Otimizando...' : 'Otimizar Tudo'}
        </Button>
      </div>

      {sugestoes && (
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold">Score Final Estimado:</p>
              <Badge className="bg-green-600 text-white text-lg">
                {sugestoes.score_final_estimado}/100
              </Badge>
            </div>
            <p className="text-xs text-gray-600">
              +{sugestoes.score_final_estimado - (artigo.score_seo_atual || 0)} pontos de melhoria
            </p>
          </div>

          <div className="space-y-2">
            {/* Título */}
            {sugestoes.titulo && (
              <div className="bg-white p-3 rounded border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Título</p>
                  <Switch
                    checked={selecoes.titulo}
                    onCheckedChange={(v) => setSelecoes(prev => ({ ...prev, titulo: v }))}
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="line-through text-gray-500">{sugestoes.titulo.atual}</div>
                  <div className="font-medium text-green-700">✓ {sugestoes.titulo.otimizado}</div>
                  <p className="text-gray-600 italic">{sugestoes.titulo.justificativa}</p>
                </div>
              </div>
            )}

            {/* Meta */}
            {sugestoes.meta && (
              <div className="bg-white p-3 rounded border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Meta Description</p>
                  <Switch
                    checked={selecoes.meta}
                    onCheckedChange={(v) => setSelecoes(prev => ({ ...prev, meta: v }))}
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="line-through text-gray-500">{sugestoes.meta.atual || 'Não definida'}</div>
                  <div className="font-medium text-green-700">✓ {sugestoes.meta.otimizado}</div>
                  <p className="text-gray-600 italic">{sugestoes.meta.justificativa}</p>
                </div>
              </div>
            )}

            {/* Keywords */}
            {sugestoes.keywords && (
              <div className="bg-white p-3 rounded border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Keywords</p>
                  <Switch
                    checked={selecoes.keywords}
                    onCheckedChange={(v) => setSelecoes(prev => ({ ...prev, keywords: v }))}
                  />
                </div>
                <div className="text-xs">
                  <div className="flex flex-wrap gap-1 mb-1">
                    {sugestoes.keywords.otimizadas?.map((kw, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-600 italic">{sugestoes.keywords.justificativa}</p>
                </div>
              </div>
            )}

            {/* Desenvolvimento Conteúdo */}
            {sugestoes.desenvolvimento_conteudo?.length > 0 && (
              <div className="bg-white p-3 rounded border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Expansão de Conteúdo ({sugestoes.desenvolvimento_conteudo.length})</p>
                  <Switch
                    checked={selecoes.conteudo}
                    onCheckedChange={(v) => setSelecoes(prev => ({ ...prev, conteudo: v }))}
                  />
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Casos de estudo: {sugestoes.desenvolvimento_conteudo.filter(d => d.caso_estudo_incluido).length}</p>
                  <p>• Dados estatísticos: {sugestoes.desenvolvimento_conteudo.filter(d => d.dados_estatisticos_incluidos).length}</p>
                </div>
              </div>
            )}

            {/* Citações Jurídicas */}
            {sugestoes.citacoes_juridicas?.length > 0 && (
              <div className="bg-white p-3 rounded border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Citações Jurídicas ({sugestoes.citacoes_juridicas.length})</p>
                  <Switch
                    checked={selecoes.citacoes}
                    onCheckedChange={(v) => setSelecoes(prev => ({ ...prev, citacoes: v }))}
                  />
                </div>
                <div className="text-xs space-y-1">
                  {sugestoes.citacoes_juridicas.slice(0, 2).map((cit, i) => (
                    <div key={i} className="bg-amber-50 p-2 rounded">
                      <p className="font-medium text-amber-900">{cit.tipo}</p>
                      <p className="text-gray-600 truncate">{cit.texto_citacao}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links Internos */}
            {sugestoes.links_internos?.length > 0 && (
              <div className="bg-white p-3 rounded border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Links Internos ({sugestoes.links_internos.length})</p>
                  <Switch
                    checked={selecoes.links_internos}
                    onCheckedChange={(v) => setSelecoes(prev => ({ ...prev, links_internos: v }))}
                  />
                </div>
                <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                  {sugestoes.links_internos.map((link, i) => (
                    <div key={i} className="bg-blue-50 p-2 rounded">
                      <p className="font-medium text-blue-900">→ {link.titulo_artigo}</p>
                      <p className="text-gray-600 italic">"{link.anchor_text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ajustes Tom */}
            {sugestoes.ajustes_tom?.length > 0 && (
              <div className="bg-white p-3 rounded border border-rose-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Tom de Voz ({sugestoes.ajustes_tom.length} ajustes)</p>
                  <Switch
                    checked={selecoes.tom}
                    onCheckedChange={(v) => setSelecoes(prev => ({ ...prev, tom: v }))}
                  />
                </div>
                <div className="text-xs space-y-1 max-h-24 overflow-y-auto">
                  {sugestoes.ajustes_tom.slice(0, 3).map((ajuste, i) => (
                    <div key={i} className="bg-rose-50 p-2 rounded">
                      <p className="text-gray-600 italic">{ajuste.mudanca_aplicada}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Referências */}
            {sugestoes.referencias_geradas?.length > 0 && (
              <div className="bg-white p-3 rounded border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium">Referências ({sugestoes.referencias_geradas.length})</p>
                  <Switch
                    checked={selecoes.referencias}
                    onCheckedChange={(v) => setSelecoes(prev => ({ ...prev, referencias: v }))}
                  />
                </div>
                <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                  {sugestoes.referencias_geradas.map((ref, i) => (
                    <div key={i} className="bg-green-50 p-2 rounded">
                      <p className="font-medium text-green-900 truncate">{ref.titulo}</p>
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs truncate block">
                        {ref.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button onClick={aplicarSelecionadas} className="w-full bg-orange-600 hover:bg-orange-700">
            <Check className="w-4 h-4 mr-2" />
            Aplicar Otimizações Selecionadas
          </Button>
        </div>
      )}
    </Card>
  );
}