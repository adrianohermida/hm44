import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, Zap, Eye, Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AssistenteSEOGaps({ artigo, onAplicarCorrecoes, onProcessingStart, onProcessingError }) {
  const [analisando, setAnalisando] = useState(false);
  const [gaps, setGaps] = useState(null);
  const [correcoes, setCorrecoes] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selecoes, setSelecoes] = useState({});

  const analisar = async () => {
    if (onProcessingStart) onProcessingStart();
    setAnalisando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise os GAPS críticos de SEO:

ARTIGO:
Título: "${artigo.titulo}" (${artigo.titulo?.length || 0} chars)
Meta: "${artigo.meta_description || 'AUSENTE'}" (${artigo.meta_description?.length || 0} chars)
Keywords: ${artigo.keywords?.join(', ') || 'NENHUMA'}
H2: ${artigo.topicos.filter(t => t.tipo === 'h2').length}
H3: ${artigo.topicos.filter(t => t.tipo === 'h3').length}
Palavras: ${artigo.topicos.reduce((acc, t) => acc + (t.texto?.split(' ').length || 0), 0)}

GAPS CRÍTICOS (detectar):
1. Título fora de 50-60 chars
2. Meta ausente ou fora de 150-160 chars
3. Menos de 3 keywords
4. Menos de 3 H2
5. Menos de 800 palavras
6. Falta palavra-chave no título
7. Densidade keyword < 1%
8. Falta links internos
9. Falta alt em imagens
10. Estrutura H2/H3 desorganizada

Para CADA gap:
- Descrição do problema
- Impacto SEO (0-10)
- Correção automática aplicável
- Justificativa`,
        response_json_schema: {
          type: "object",
          properties: {
            gaps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipo: { type: "string" },
                  descricao: { type: "string" },
                  impacto: { type: "number" },
                  correcao: { type: "string" },
                  aplicavel: { type: "boolean" }
                }
              }
            },
            score_atual: { type: "number" },
            score_pos_correcao: { type: "number" }
          }
        }
      });

      if (!resultado?.gaps) {
        toast.error('Resposta inválida da IA');
        if (onProcessingError) onProcessingError();
        return;
      }
      
      setGaps(resultado);
      toast.success(`${resultado.gaps.length} gaps detectados`);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao analisar');
      if (onProcessingError) onProcessingError();
    } finally {
      setAnalisando(false);
    }
  };

  const gerarCorrecoes = async () => {
    if (!gaps?.gaps) {
      toast.error('Analise os gaps primeiro');
      return;
    }

    const gapsAplicaveis = gaps.gaps.filter(g => g.aplicavel);
    
    if (gapsAplicaveis.length === 0) {
      toast.error('Nenhum gap aplicável automaticamente');
      return;
    }
    
    if (onProcessingStart) onProcessingStart();
    setAnalisando(true);
    
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Gere correções automáticas para os gaps de SEO:

ARTIGO ATUAL:
Título: "${artigo.titulo}"
Meta: "${artigo.meta_description || 'AUSENTE'}"
Keywords: ${artigo.keywords?.join(', ') || 'NENHUMA'}
Estrutura H2 atual: ${artigo.topicos.filter(t => t.tipo === 'h2').map(t => t.texto).join(', ')}

GAPS DETECTADOS:
${gapsAplicaveis.map(g => `- ${g.tipo}: ${g.descricao}`).join('\n')}

Para CADA gap aplicável, gere correção:
1. Se tipo = 'titulo': gere título otimizado 50-60 chars com palavra-chave
2. Se tipo = 'meta': gere meta description 150-160 chars persuasiva
3. Se tipo = 'keywords': gere 5-7 keywords relevantes separadas por vírgula
4. Se tipo = 'h2_estrutura': RENOMEIE os H2 existentes para melhorar hierarquia (NÃO adicione novos)
5. Se tipo = 'imagem_alt': gere alt text descritivo 120-140 chars`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            meta_description: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            h2_renomeados: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  index: { type: "number" },
                  texto_novo: { type: "string" }
                }
              }
            },
            imagem_alt: { type: "string" }
          }
        }
      });

      const correcoesGeradas = {
        antes: {
          titulo: artigo.titulo,
          meta_description: artigo.meta_description,
          keywords: artigo.keywords,
          imagem_alt: artigo.imagem_alt
        },
        depois: {}
      };

      if (resultado.titulo) correcoesGeradas.depois.titulo = resultado.titulo;
      if (resultado.meta_description) correcoesGeradas.depois.meta_description = resultado.meta_description;
      if (resultado.keywords?.length > 0) correcoesGeradas.depois.keywords = resultado.keywords;
      if (resultado.imagem_alt) correcoesGeradas.depois.imagem_alt = resultado.imagem_alt;
      
      // Renomear H2 existentes ao invés de adicionar novos
      if (resultado.h2_renomeados?.length > 0) {
        const topicosH2 = artigo.topicos.filter(t => t.tipo === 'h2');
        correcoesGeradas.antes.h2_textos = topicosH2.map(t => t.texto);
        correcoesGeradas.depois.h2_renomeados = resultado.h2_renomeados;
      }

      setCorrecoes(correcoesGeradas);
      // Selecionar todas por padrão
      const selecoesPadrao = {};
      if (resultado.titulo) selecoesPadrao.titulo = true;
      if (resultado.meta_description) selecoesPadrao.meta_description = true;
      if (resultado.keywords?.length > 0) selecoesPadrao.keywords = true;
      if (resultado.imagem_alt) selecoesPadrao.imagem_alt = true;
      if (resultado.h2_renomeados?.length > 0) selecoesPadrao.h2_renomeados = true;
      setSelecoes(selecoesPadrao);
      setPreviewOpen(true);
    } catch (error) {
      toast.error('Erro ao gerar correções');
      if (onProcessingError) onProcessingError();
    } finally {
      setAnalisando(false);
    }
  };

  const aplicarCorrecoesManuais = () => {
    if (!correcoes) return;

    const dados = {};
    let aplicadas = 0;
    
    // Aplicar correções simples SOMENTE se selecionadas
    if (selecoes.titulo && correcoes.depois.titulo) {
      dados.titulo = correcoes.depois.titulo;
      aplicadas++;
    }
    if (selecoes.meta_description && correcoes.depois.meta_description) {
      dados.meta_description = correcoes.depois.meta_description;
      aplicadas++;
    }
    if (selecoes.keywords && correcoes.depois.keywords) {
      dados.keywords = correcoes.depois.keywords;
      aplicadas++;
    }
    if (selecoes.imagem_alt && correcoes.depois.imagem_alt) {
      dados.imagem_alt = correcoes.depois.imagem_alt;
      aplicadas++;
    }
    
    // Aplicar renomeação de H2 SOMENTE se selecionada
    if (selecoes.h2_renomeados && correcoes.depois.h2_renomeados?.length > 0) {
      const topicosAtualizados = [...artigo.topicos];
      const h2Indices = topicosAtualizados
        .map((t, i) => t.tipo === 'h2' ? i : -1)
        .filter(i => i !== -1);
      
      correcoes.depois.h2_renomeados.forEach(renomeacao => {
        const indiceReal = h2Indices[renomeacao.index];
        if (indiceReal !== undefined && topicosAtualizados[indiceReal]) {
          topicosAtualizados[indiceReal].texto = renomeacao.texto_novo;
        }
      });
      
      dados.topicos = topicosAtualizados;
      aplicadas++;
    }

    if (aplicadas === 0) {
      toast.error('Selecione ao menos uma correção');
      return;
    }

    onAplicarCorrecoes(dados);
    setPreviewOpen(false);
    setCorrecoes(null);
    setSelecoes({});
    toast.success(`✨ ${aplicadas} correção(ões) aplicada(s)!`);
  };

  return (
    <>
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              Gaps de SEO
            </span>
            {gaps && (
              <Badge variant={gaps.score_atual >= 80 ? 'default' : 'destructive'}>
                {gaps.score_atual}/100
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={analisar} disabled={analisando} size="sm" className="w-full">
            {analisando ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Zap className="w-3 h-3 mr-2" />}
            Detectar Gaps
          </Button>

          {gaps?.gaps && (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {gaps.gaps.map((gap, i) => (
                  <div key={i} className={`p-2 rounded border ${gap.aplicavel ? 'bg-white' : 'bg-gray-100'}`}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-semibold">{gap.descricao}</p>
                      <Badge variant={gap.impacto >= 7 ? 'destructive' : 'outline'} className="text-xs">
                        {gap.impacto}/10
                      </Badge>
                    </div>
                    {gap.aplicavel ? (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Correção automática disponível
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">Manual</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-gray-600 mb-2">
                  Score pós-correção: <span className="font-bold text-green-600">{gaps.score_pos_correcao}/100</span>
                </p>
                <Button 
                  onClick={gerarCorrecoes} 
                  disabled={analisando}
                  size="sm" 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {analisando ? (
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  ) : (
                    <Eye className="w-3 h-3 mr-2" />
                  )}
                  Gerar Preview de Correções
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview das Correções SEO</DialogTitle>
          </DialogHeader>

          {correcoes && (
            <div className="space-y-4">
              {correcoes.depois.titulo && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Título</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selecoes.titulo || false}
                        onChange={(e) => setSelecoes(prev => ({ ...prev, titulo: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-600">Aplicar</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                      <p className="text-xs text-red-600 font-medium mb-1">Antes:</p>
                      <p className="text-sm">{correcoes.antes.titulo}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <p className="text-xs text-green-600 font-medium mb-1">Depois:</p>
                      <p className="text-sm">{correcoes.depois.titulo}</p>
                    </div>
                  </div>
                </div>
              )}

              {correcoes.depois.meta_description && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Meta Description</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selecoes.meta_description || false}
                        onChange={(e) => setSelecoes(prev => ({ ...prev, meta_description: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-600">Aplicar</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                      <p className="text-xs text-red-600 font-medium mb-1">Antes:</p>
                      <p className="text-sm">{correcoes.antes.meta_description || 'AUSENTE'}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <p className="text-xs text-green-600 font-medium mb-1">Depois:</p>
                      <p className="text-sm">{correcoes.depois.meta_description}</p>
                    </div>
                  </div>
                </div>
              )}

              {correcoes.depois.keywords && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Keywords</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selecoes.keywords || false}
                        onChange={(e) => setSelecoes(prev => ({ ...prev, keywords: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-600">Aplicar</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                      <p className="text-xs text-red-600 font-medium mb-1">Antes:</p>
                      <p className="text-sm">{correcoes.antes.keywords?.join(', ') || 'NENHUMA'}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <p className="text-xs text-green-600 font-medium mb-1">Depois:</p>
                      <p className="text-sm">{correcoes.depois.keywords.join(', ')}</p>
                    </div>
                  </div>
                </div>
              )}

              {correcoes.depois.h2_renomeados && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Títulos H2 (Renomeação)</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selecoes.h2_renomeados || false}
                        onChange={(e) => setSelecoes(prev => ({ ...prev, h2_renomeados: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-600">Aplicar</span>
                    </label>
                  </div>
                  <div className="space-y-3">
                    {correcoes.depois.h2_renomeados.map((renomeacao, i) => (
                      <div key={i} className="space-y-2">
                        <div className="bg-red-50 p-2 rounded border border-red-200">
                          <p className="text-xs text-red-600 font-medium mb-1">H2 #{renomeacao.index + 1} Antes:</p>
                          <p className="text-sm">{correcoes.antes.h2_textos?.[renomeacao.index]}</p>
                        </div>
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <p className="text-xs text-green-600 font-medium mb-1">H2 #{renomeacao.index + 1} Depois:</p>
                          <p className="text-sm">{renomeacao.texto_novo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {correcoes.depois.imagem_alt && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Alt da Imagem de Capa</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selecoes.imagem_alt || false}
                        onChange={(e) => setSelecoes(prev => ({ ...prev, imagem_alt: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-600">Aplicar</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                      <p className="text-xs text-red-600 font-medium mb-1">Antes:</p>
                      <p className="text-sm">{correcoes.antes.imagem_alt || 'AUSENTE'}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <p className="text-xs text-green-600 font-medium mb-1">Depois:</p>
                      <p className="text-sm">{correcoes.depois.imagem_alt}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={aplicarCorrecoesManuais} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={Object.values(selecoes).every(v => !v)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Aplicar Correções Selecionadas ({Object.values(selecoes).filter(Boolean).length})
                </Button>
                <Button 
                  onClick={() => setPreviewOpen(false)} 
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}