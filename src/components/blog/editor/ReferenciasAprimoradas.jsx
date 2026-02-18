import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Trash2, ExternalLink, Sparkles, Search, Star, GripVertical, Check, X, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ReferenciasAprimoradas({ referencias = [], onChange, titulo, topicos }) {
  const [buscandoFontes, setBuscandoFontes] = useState(false);
  const [novaRef, setNovaRef] = useState({ titulo: '', url: '', tipo: 'jurisprudencia' });
  const [sugestoes, setSugestoes] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [gerandoSugestoes, setGerandoSugestoes] = useState(false);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: fontesRepositorio = [] } = useQuery({
    queryKey: ['fontes-repositorio', escritorio?.id],
    queryFn: () => base44.entities.FonteRepositorio.filter(
      { escritorio_id: escritorio.id, ativo: true },
      '-vezes_utilizada',
      10
    ),
    enabled: !!escritorio
  });

  const buscarFontesAutomaticamente = async () => {
    if (!escritorio) return;
    setBuscandoFontes(true);
    try {
      const conteudo = topicos.map(t => t.texto || '').join(' ').substring(0, 1500);
      const fontesRepo = fontesRepositorio.map(f => `- ${f.titulo} (${f.tipo}) - ${f.url}`).join('\n');
      
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `ANÁLISE INTELIGENTE DE FONTES + ANTI-PLÁGIO

ARTIGO:
Título: "${titulo}"
Conteúdo: ${conteudo}

REPOSITÓRIO DISPONÍVEL (priorizar estas):
${fontesRepo}

OBJETIVOS:
1. SUGERIR fontes confiáveis (priorizar repositório)
2. FORMATAR citações ABNT
3. IDENTIFICAR trechos que precisam atribuição (anti-plágio)

CRITÉRIOS DE FONTES:
- Oficiais: STF, STJ, TST, Planalto, CNJ, tribunais
- Legislação vigente com artigos específicos
- Jurisprudências com número/ano
- Doutrinas de autores reconhecidos
- URLs permanentes e acessíveis

Para CADA fonte retorne:
- Título completo oficial
- URL verificável
- Tipo (legislacao/jurisprudencia/doutrina/portal_juridico)
- Citação ABNT formatada
- Justificativa de relevância
- Indica se está no repositório

ANTI-PLÁGIO:
Identifique trechos do artigo que:
- Parecem copiados sem atribuição
- Precisam de citação direta (aspas)
- Requerem paráfrase
- Necessitam fonte específica`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            fontes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  url: { type: "string" },
                  tipo: { type: "string" },
                  citacao_abnt: { type: "string" },
                  relevancia: { type: "string" },
                  no_repositorio: { type: "boolean" }
                }
              }
            },
            alertas_plagio: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  trecho: { type: "string" },
                  problema: { type: "string" },
                  solucao: { type: "string" }
                }
              }
            }
          }
        }
      });

      const fontesFormatadas = resultado.fontes.map(f => ({
        ...f,
        data_acesso: new Date().toISOString()
      }));

      onChange([...referencias, ...fontesFormatadas]);
      
      if (resultado.alertas_plagio?.length > 0) {
        toast.warning(`${resultado.alertas_plagio.length} trechos precisam citação/atribuição`);
      }
      
      // Incrementar contador e adicionar novas ao repositório
      for (const fonte of resultado.fontes) {
        const fonteExistente = fontesRepositorio.find(f => f.url === fonte.url);
        if (fonteExistente) {
          await base44.entities.FonteRepositorio.update(fonteExistente.id, {
            vezes_utilizada: (fonteExistente.vezes_utilizada || 0) + 1,
            ultima_utilizacao: new Date().toISOString()
          });
        } else if (!fonte.no_repositorio) {
          await base44.entities.FonteRepositorio.create({
            escritorio_id: escritorio.id,
            titulo: fonte.titulo,
            url: fonte.url,
            tipo: fonte.tipo,
            confiabilidade: 'alta',
            descricao: fonte.relevancia,
            vezes_utilizada: 1,
            ultima_utilizacao: new Date().toISOString(),
            ativo: true
          });
        }
      }
      
      toast.success(`${resultado.fontes.length} fontes encontradas e formatadas!`);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao buscar fontes');
    } finally {
      setBuscandoFontes(false);
    }
  };

  const formatarCitacaoABNT = (ref) => {
    const dataAcesso = new Date().toLocaleDateString('pt-BR');
    if (ref.tipo === 'legislacao') {
      return `${ref.titulo}. Disponível em: <${ref.url}>. Acesso em: ${dataAcesso}.`;
    } else if (ref.tipo === 'jurisprudencia') {
      return `${ref.titulo}. Disponível em: <${ref.url}>. Acesso em: ${dataAcesso}.`;
    }
    return `${ref.titulo}. Disponível em: <${ref.url}>. Acesso em: ${dataAcesso}.`;
  };

  const adicionarReferencia = () => {
    if (!novaRef.titulo || !novaRef.url) {
      toast.error('Preencha título e URL');
      return;
    }
    const refFormatada = {
      ...novaRef,
      citacao_abnt: formatarCitacaoABNT(novaRef),
      data_acesso: new Date().toISOString()
    };
    onChange([...referencias, refFormatada]);
    setNovaRef({ titulo: '', url: '', tipo: 'jurisprudencia' });
    toast.success('Referência adicionada e formatada ABNT');
  };

  const iniciarDrag = (e, ref, index) => {
    const citacaoCompleta = ref.citacao_abnt || formatarCitacaoABNT(ref);
    const textoParaInserir = `\n\n**Fonte [${index + 1}]:** ${citacaoCompleta}\n\n`;
    e.dataTransfer.setData('text/plain', textoParaInserir);
    e.dataTransfer.effectAllowed = 'copy';
    toast.info('Arraste e solte no editor para inserir citação');
  };

  const gerarSugestoesAutomaticas = async () => {
    if (!referencias.length || !topicos.length) {
      toast.error('Adicione referências e conteúdo primeiro');
      return;
    }

    setGerandoSugestoes(true);
    try {
      const conteudo = topicos.map(t => t.texto || '').join('\n\n');
      
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise o conteúdo e sugira onde inserir citações:

CONTEÚDO DO ARTIGO:
${conteudo}

REFERÊNCIAS DISPONÍVEIS:
${referencias.map((r, i) => `[${i + 1}] ${r.titulo} - ${r.tipo}`).join('\n')}

Para cada sugestão, retorne:
- Índice do tópico onde inserir (baseado na ordem)
- Número da referência [n]
- Texto antes da citação (contexto)
- Texto após a citação
- Justificativa da inserção

REGRAS:
- Sugerir no máximo 5 inserções estratégicas
- Priorizar após afirmações jurídicas importantes
- Evitar inserções em introduções genéricas
- Inserir após dados estatísticos ou legais`,
        response_json_schema: {
          type: "object",
          properties: {
            sugestoes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  topico_index: { type: "number" },
                  referencia_numero: { type: "number" },
                  texto_antes: { type: "string" },
                  texto_depois: { type: "string" },
                  justificativa: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSugestoes(resultado.sugestoes);
      setPreviewOpen(true);
      toast.success(`${resultado.sugestoes.length} sugestões geradas!`);
    } catch (error) {
      toast.error('Erro ao gerar sugestões');
    } finally {
      setGerandoSugestoes(false);
    }
  };

  const aplicarSugestoes = () => {
    if (!sugestoes || !topicos.length) return;

    const topicosAtualizados = [...topicos];
    
    // Aplicar sugestões em ordem reversa para não afetar índices
    sugestoes.sort((a, b) => b.topico_index - a.topico_index).forEach(sug => {
      const topico = topicosAtualizados[sug.topico_index];
      if (topico && topico.texto) {
        const ref = referencias[sug.referencia_numero - 1];
        const citacao = ref.citacao_abnt || formatarCitacaoABNT(ref);
        topico.texto = `${topico.texto}\n\n**Fonte [${sug.referencia_numero}]:** ${citacao}`;
      }
    });

    window.dispatchEvent(new CustomEvent('aplicarTopicosAtualizados', {
      detail: { topicos: topicosAtualizados }
    }));

    setPreviewOpen(false);
    setSugestoes(null);
    toast.success('✨ Citações inseridas automaticamente!');
  };

  const removerReferencia = (index) => {
    onChange(referencias.filter((_, i) => i !== index));
    toast.success('Referência removida');
  };

  const getTipoColor = (tipo) => {
    if (tipo === 'legislacao') return 'bg-blue-100 text-blue-800';
    if (tipo === 'jurisprudencia') return 'bg-purple-100 text-purple-800';
    if (tipo === 'doutrina') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-700" />
          <h3 className="font-bold text-amber-900">Referências & Fontes</h3>
        </div>
        <Badge className="bg-amber-600 text-white">
          {referencias.length} fontes
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <Button
          onClick={buscarFontesAutomaticamente}
          disabled={buscandoFontes || !titulo}
          className="w-full bg-amber-600 hover:bg-amber-700"
          size="sm"
        >
          <Search className={`w-3 h-3 mr-2 ${buscandoFontes ? 'animate-pulse' : ''}`} />
          {buscandoFontes ? 'Buscando fontes...' : 'Buscar Fontes Confiáveis (IA)'}
        </Button>

        {referencias.length > 0 && (
          <Button
            onClick={gerarSugestoesAutomaticas}
            disabled={gerandoSugestoes}
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Sparkles className={`w-3 h-3 mr-2 ${gerandoSugestoes ? 'animate-pulse' : ''}`} />
            {gerandoSugestoes ? 'Analisando...' : 'Sugerir Inserções Automáticas'}
          </Button>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded p-2">
          <p className="text-xs text-blue-800 flex items-center gap-1">
            <GripVertical className="w-3 h-3" />
            <span className="font-medium">Dica:</span> Arraste e solte referências no editor para inserir citação ABNT
          </p>
        </div>

        {fontesRepositorio.length > 0 && (
          <div className="bg-amber-100 p-2 rounded border border-amber-300">
            <p className="text-xs font-medium text-amber-900 mb-2 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Fontes Mais Usadas:
            </p>
            <div className="space-y-1">
              {fontesRepositorio.slice(0, 3).map((fonte) => (
                <button
                  key={fonte.id}
                  onClick={() => {
                    onChange([...referencias, {
                      titulo: fonte.titulo,
                      url: fonte.url,
                      tipo: fonte.tipo,
                      data_acesso: new Date().toISOString()
                    }]);
                    base44.entities.FonteRepositorio.update(fonte.id, {
                      vezes_utilizada: (fonte.vezes_utilizada || 0) + 1,
                      ultima_utilizacao: new Date().toISOString()
                    });
                    toast.success('Fonte adicionada!');
                  }}
                  className="w-full text-left p-2 bg-white rounded border border-amber-200 hover:bg-amber-50 transition-colors"
                >
                  <p className="text-xs font-medium text-gray-800 truncate">{fonte.titulo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="text-xs">{fonte.tipo}</Badge>
                    <span className="text-xs text-gray-500">{fonte.vezes_utilizada}x</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-3 max-h-80 overflow-y-auto">
        {referencias.map((ref, i) => (
          <div 
            key={i} 
            draggable
            onDragStart={(e) => iniciarDrag(e, ref, i)}
            className="bg-white p-3 rounded border border-amber-200 shadow-sm cursor-move hover:shadow-md hover:border-amber-400 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-start gap-2 flex-1">
                <GripVertical className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-xs font-bold text-gray-500 mt-1">[{i + 1}]</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{ref.titulo}</p>
                  {ref.citacao_abnt && (
                    <div className="bg-gray-50 p-2 rounded mt-2 border border-gray-200">
                      <p className="text-xs text-gray-700 italic leading-relaxed">{ref.citacao_abnt}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removerReferencia(i)}
                  className="h-6 w-6"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <Badge className={getTipoColor(ref.tipo)} variant="outline">
                {ref.tipo}
              </Badge>
              <a 
                href={ref.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
              >
                <ExternalLink className="w-3 h-3" />
                Acessar fonte
              </a>
            </div>
            
            {ref.relevancia && (
              <p className="text-gray-600 mt-2 text-xs italic border-l-2 border-amber-300 pl-2">
                {ref.relevancia}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-amber-200 pt-3">
        <Input
          placeholder="Título da referência"
          value={novaRef.titulo}
          onChange={(e) => setNovaRef(prev => ({ ...prev, titulo: e.target.value }))}
          className="text-xs"
        />
        <Input
          placeholder="URL da fonte"
          value={novaRef.url}
          onChange={(e) => setNovaRef(prev => ({ ...prev, url: e.target.value }))}
          className="text-xs"
        />
        <Button size="sm" onClick={adicionarReferencia} className="w-full" variant="outline">
          <Plus className="w-3 h-3 mr-1" />
          Adicionar Manualmente
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sugestões de Inserção de Citações</DialogTitle>
          </DialogHeader>

          {sugestoes && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">
                  <strong>{sugestoes.length} inserções sugeridas</strong> - Revise antes de aplicar
                </p>
              </div>

              {sugestoes.map((sug, i) => {
                const ref = referencias[sug.referencia_numero - 1];
                const topico = topicos[sug.topico_index];
                
                return (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="bg-amber-600 text-white mb-2">
                          Sugestão #{i + 1}
                        </Badge>
                        <p className="text-sm text-gray-600">{sug.justificativa}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <p className="text-xs text-red-600 font-medium mb-1">Antes (sem citação):</p>
                        <p className="text-sm">{topico?.texto?.substring(0, 200)}...</p>
                      </div>

                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-xs text-green-600 font-medium mb-1">Depois (com citação [{ sug.referencia_numero}]):</p>
                        <p className="text-sm">
                          {topico?.texto?.substring(0, 200)}...
                          <br />
                          <br />
                          <strong className="text-amber-700">
                            Fonte [{sug.referencia_numero}]: {ref?.citacao_abnt || formatarCitacaoABNT(ref)}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2 rounded border">
                      <p className="text-xs text-gray-600">
                        <strong>Fonte:</strong> {ref?.titulo}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={aplicarSugestoes} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Aplicar Todas as Citações
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
    </Card>
  );
}