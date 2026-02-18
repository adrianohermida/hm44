import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, Plus, Sparkles, FileText, Search, Settings, Loader2 } from "lucide-react";
import AIProcessingIndicator from "@/components/blog/editor/AIProcessingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/components/seo/Breadcrumb";
import { createPageUrl } from "@/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import EditorTopicoInline from "@/components/blog/editor/EditorTopicoInline";
import DisclaimerPanel from "@/components/blog/editor/DisclaimerPanel";
import SlugGeneratorAI from "@/components/blog/editor/SlugGeneratorAI";
import TitulosAlternativosAI from "@/components/blog/editor/TitulosAlternativosAI";
import MetaDescriptionAI from "@/components/blog/editor/MetaDescriptionAI";
import ScoreSEOLive from "@/components/blog/editor/ScoreSEOLive";
import ReferenciasAprimoradas from "@/components/blog/editor/ReferenciasAprimoradas";
import OtimizadorAvancado from "@/components/blog/editor/OtimizadorAvancado";
import ImageAltGenerator from "@/components/blog/editor/ImageAltGenerator";
import SugestaoLinksInternos from "@/components/blog/editor/SugestaoLinksInternos";
import ABTestingTitulos from "@/components/blog/editor/ABTestingTitulos";
import LegibilidadeOtimizador from "@/components/blog/editor/LegibilidadeOtimizador";
import IntencaoBuscaAplicador from "@/components/blog/seo/IntencaoBuscaAplicador";
import OtimizadorAvancadoV2 from "@/components/blog/editor/OtimizadorAvancadoV2";
import ABTestingAvancado from "@/components/blog/editor/ABTestingAvancado";
import OtimizacaoRapida from "@/components/blog/editor/OtimizacaoRapida";
import GeradorImagensIA from "@/components/blog/editor/GeradorImagensIA";
import NarradorAudio from "@/components/blog/editor/NarradorAudio";
import AssistenteIAAvancado from "@/components/blog/editor/AssistenteIAAvancado";
import AssistenteSEOGaps from "@/components/blog/editor/AssistenteSEOGaps";
import AnalisadorConteudoIA from "@/components/blog/editor/AnalisadorConteudoIA";
import GeradorTopicosIA from "@/components/blog/editor/GeradorTopicosIA";
import ArtigosRelacionadosManager from "@/components/blog/editor/ArtigosRelacionadosManager";
import HistoricoVersoes from "@/components/blog/editor/HistoricoVersoes";
import CategorizadorIA from "@/components/blog/editor/CategorizadorIA";
import PreviewModal from "@/components/blog/editor/PreviewModal";
import GeradorArtigoCompleto from "@/components/blog/editor/GeradorArtigoCompleto";
import ReescritorTom from "@/components/blog/editor/ReescritorTom";
import GeradorFAQ from "@/components/blog/editor/GeradorFAQ";
import SugestorImagensContextuais from "@/components/blog/editor/SugestorImagensContextuais";

export default function EditorBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(location.search);
  const artigoId = params.get('id');
  const filaId = params.get('filaId');
  const autoOtimizar = params.get('otimizar') === 'true';
  
  const [showPreview, setShowPreview] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("conteudo");
  const [aiProcessing, setAIProcessing] = useState({ active: false, tool: '', status: 'idle' });
  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    url_canonica: '',
    resumo: '',
    categoria: 'direito_consumidor',
    autor: '',
    status: 'rascunho',
    publicado: false,
    imagem_capa: '',
    imagem_alt: '',
    meta_description: '',
    keywords: [],
    topicos: [],
    referencias: [],
    disclaimer_ativo: true,
    disclaimer_texto: 'Aviso Legal: Este artigo tem caráter meramente informativo e não substitui a consulta a um advogado. Cada caso possui suas particularidades e deve ser analisado por um profissional qualificado de sua confiança.'
  });

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: artigo } = useQuery({
    queryKey: ['blog-artigo', artigoId],
    queryFn: async () => {
      if (!artigoId) return null;
      const result = await base44.entities.Blog.filter({ id: artigoId });
      return result[0];
    },
    enabled: !!artigoId
  });

  const { data: itemFila } = useQuery({
    queryKey: ['artigo-fila-item', filaId],
    queryFn: async () => {
      if (!filaId) return null;
      const result = await base44.entities.ArtigoFila.filter({ id: filaId });
      return result[0];
    },
    enabled: !!filaId
  });

  useEffect(() => {
    if (autoOtimizar && artigoId) {
      triggerOtimizacao();
    }
  }, [autoOtimizar, artigoId]);

  const triggerOtimizacao = async () => {
    try {
      const { data } = await base44.functions.invoke('otimizarArtigo', { id: artigoId });
      toast.success(`Artigo otimizado! ${data.melhorias?.join(', ')}`);
      queryClient.invalidateQueries(['blog-artigo', artigoId]);
    } catch (error) {
      toast.error('Erro ao otimizar: ' + error.message);
    }
  };

  useEffect(() => {
    if (artigo) {
      setFormData({
        titulo: artigo.titulo || '',
        slug: artigo.slug || '',
        url_canonica: artigo.url_canonica || '',
        resumo: artigo.resumo || '',
        categoria: artigo.categoria || 'direito_consumidor',
        autor: artigo.autor || user?.full_name || '',
        status: artigo.status || 'rascunho',
        publicado: artigo.publicado || false,
        imagem_capa: artigo.imagem_capa || '',
        imagem_alt: artigo.imagem_alt || '',
        meta_description: artigo.meta_description || '',
        keywords: artigo.keywords || [],
        topicos: artigo.topicos || [],
        referencias: artigo.referencias || [],
        disclaimer_ativo: artigo.disclaimer_ativo ?? true,
        disclaimer_texto: artigo.disclaimer_texto || 'Aviso Legal: Este artigo tem caráter meramente informativo e não substitui a consulta a um advogado. Cada caso possui suas particularidades e deve ser analisado por um profissional qualificado de sua confiança.'
      });
    } else if (itemFila) {
      // Inicializar com dados da fila
      setFormData(prev => ({
        ...prev,
        titulo: itemFila.titulo_proposto || '',
        keywords: itemFila.keywords || [],
        topicos: itemFila.estrutura_sugerida?.h2?.map((h2, i) => ({
          id: Date.now() + i,
          tipo: 'h2',
          texto: h2
        })) || [],
        autor: user?.full_name || ''
      }));
    } else if (user) {
      setFormData(prev => ({ ...prev, autor: user.full_name }));
    }

    const handleAdicionarParagrafos = (e) => {
      const { paragrafos, aposTopicoId } = e.detail;
      setFormData(prev => {
        const topicos = [...prev.topicos];
        const indice = topicos.findIndex(t => t.id === aposTopicoId);
        if (indice !== -1) {
          const novosTopicos = paragrafos.map(p => ({
            id: Date.now() + Math.random(),
            tipo: 'paragrafo',
            texto: p.texto
          }));
          topicos.splice(indice + 1, 0, ...novosTopicos);
        }
        return { ...prev, topicos };
      });
      toast.success('Parágrafos adicionados automaticamente!');
    };

    const handleAdicionarImagemAposTopico = (e) => {
      const { topicoId, imagemUrl, altText } = e.detail;
      setFormData(prev => {
        const topicos = [...prev.topicos];
        const indice = topicos.findIndex(t => t.id === topicoId);
        if (indice !== -1) {
          const novaImagem = {
            id: Date.now() + Math.random(),
            tipo: 'paragrafo',
            texto: `![${altText}](${imagemUrl})`
          };
          topicos.splice(indice + 1, 0, novaImagem);
        }
        return { ...prev, topicos };
      });
      toast.success('Imagem inserida após o título!');
    };

    const handleAplicarTopicosAtualizados = (e) => {
      const { topicos } = e.detail;
      setFormData(prev => ({ ...prev, topicos }));
    };

    window.addEventListener('adicionarParagrafos', handleAdicionarParagrafos);
    window.addEventListener('adicionarImagemAposTopico', handleAdicionarImagemAposTopico);
    window.addEventListener('aplicarTopicosAtualizados', handleAplicarTopicosAtualizados);
    return () => {
      window.removeEventListener('adicionarParagrafos', handleAdicionarParagrafos);
      window.removeEventListener('adicionarImagemAposTopico', handleAdicionarImagemAposTopico);
      window.removeEventListener('aplicarTopicosAtualizados', handleAplicarTopicosAtualizados);
    };
  }, [artigo, itemFila, user]);

  const calcularScoreSlug = (slug, keyword) => {
    if (!slug) return 0;
    let score = 0;
    if (slug.length >= 3 && slug.length <= 60) score += 30;
    if (keyword && slug.includes(keyword.toLowerCase().replace(/\s+/g, '-'))) score += 40;
    if (!/[^a-z0-9-]/.test(slug)) score += 20;
    if (slug.split('-').length >= 3 && slug.split('-').length <= 6) score += 10;
    return score;
  };

  const calcularScoreMeta = (meta) => {
    if (!meta) return 0;
    let score = 0;
    if (meta.length >= 150 && meta.length <= 160) score += 100;
    else if (meta.length >= 120 && meta.length < 150) score += 70;
    else if (meta.length > 160 && meta.length <= 180) score += 60;
    else if (meta.length > 0) score += 30;
    return score;
  };

  const calcularScoreSEO = (data) => {
    let score = 0;
    if (data.titulo.length >= 40 && data.titulo.length <= 60) score += 15;
    if (data.meta_description?.length >= 150 && data.meta_description.length <= 160) score += 15;
    if (data.slug.length >= 3 && data.slug.length <= 60) score += 15;
    if (data.keywords?.length >= 3) score += 10;
    if (data.imagem_capa) score += 10;
    const palavras = data.topicos.reduce((acc, t) => acc + (t.texto?.split(' ').length || 0), 0);
    if (palavras >= 800) score += 25;
    const h2Count = data.topicos.filter(t => t.tipo === 'h2').length;
    if (h2Count >= 2) score += 10;
    return score;
  };

  const gerarUrlCanonica = (slug) => {
    const baseUrl = 'https://hermidamaia.adv.br';
    return slug ? `${baseUrl}/blog/${slug}` : '';
  };

  const salvarMutation = useMutation({
    mutationFn: async (data) => {
      const conteudoCompleto = montarConteudoCompleto(data.topicos, data.disclaimer_ativo, data.disclaimer_texto);
      const scoreSlug = calcularScoreSlug(data.slug, data.keywords?.[0] || '');
      const scoreMeta = calcularScoreMeta(data.meta_description);
      const scoreSEO = calcularScoreSEO(data);
      
      const urlCanonica = data.slug ? gerarUrlCanonica(data.slug) : '';
      
      const payload = {
        ...data,
        conteudo: conteudoCompleto,
        escritorio_id: escritorio.id,
        data_publicacao: data.publicado ? new Date().toISOString() : data.data_publicacao,
        status: data.publicado ? "publicado" : data.status,
        score_slug: scoreSlug,
        score_meta: scoreMeta,
        score_seo_atual: scoreSEO,
        url_canonica: urlCanonica || data.url_canonica,
        url_antiga: artigoId && !artigo?.slug ? `/BlogPost?id=${artigoId}` : undefined
      };

      let resultado;
      if (artigoId) {
        resultado = await base44.entities.Blog.update(artigoId, payload);
        
        // Salvar versão no histórico
        const versoes = await base44.entities.BlogVersion.filter({ blog_id: artigoId });
        const proximaVersao = (versoes[0]?.versao_numero || 0) + 1;
        
        await base44.entities.BlogVersion.create({
          blog_id: artigoId,
          escritorio_id: escritorio.id,
          versao_numero: proximaVersao,
          titulo: data.titulo,
          conteudo: conteudoCompleto,
          topicos: data.topicos,
          meta_description: data.meta_description,
          keywords: data.keywords,
          score_seo: scoreSEO,
          tipo_mudanca: 'manual',
          descricao_mudanca: 'Edição manual do artigo',
          autor_mudanca: user?.email
        });
      } else {
        resultado = await base44.entities.Blog.create(payload);
        
        // Criar primeira versão
        if (resultado?.id) {
          await base44.entities.BlogVersion.create({
            blog_id: resultado.id,
            escritorio_id: escritorio.id,
            versao_numero: 1,
            titulo: data.titulo,
            conteudo: conteudoCompleto,
            topicos: data.topicos,
            meta_description: data.meta_description,
            keywords: data.keywords,
            score_seo: scoreSEO,
            tipo_mudanca: 'manual',
            descricao_mudanca: 'Criação inicial do artigo',
            autor_mudanca: user?.email
          });
        }
      }

      // Atualizar fila se veio de lá
      if (filaId && resultado?.id) {
        await base44.entities.ArtigoFila.update(filaId, {
          artigo_id: resultado.id,
          status: data.publicado ? 'publicado' : 'em_desenvolvimento',
          score_atual: scoreSEO
        });
      }

      return resultado;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['blog-admin']);
      queryClient.invalidateQueries(['blog-artigo']);
      queryClient.invalidateQueries(['artigos-fila']);
      toast.success("Artigo salvo!");
      if (!artigoId && data?.id) {
        navigate(`/EditorBlog?id=${data.id}${filaId ? `&filaId=${filaId}` : ''}`, { replace: true });
      }
    }
  });

  const montarConteudoCompleto = (topicos, disclaimerAtivo, disclaimerTexto) => {
    let conteudo = '';
    topicos.forEach(topico => {
      if (topico.tipo === 'h1') conteudo += `# ${topico.texto}\n\n`;
      else if (topico.tipo === 'h2') conteudo += `## ${topico.texto}\n\n`;
      else if (topico.tipo === 'h3') conteudo += `### ${topico.texto}\n\n`;
      else if (topico.tipo === 'paragrafo') conteudo += `${topico.texto}\n\n`;
      else if (topico.tipo === 'lista') {
        topico.itens?.forEach(item => conteudo += `- ${item}\n`);
        conteudo += '\n';
      }
    });
    if (disclaimerAtivo && disclaimerTexto) {
      conteudo += `\n---\n\n**${disclaimerTexto}**\n`;
    }
    return conteudo;
  };

  const adicionarTopico = (tipo) => {
    const novoTopico = {
      id: Date.now(),
      tipo,
      texto: '',
      itens: tipo === 'lista' ? [''] : undefined
    };
    setFormData(prev => ({ ...prev, topicos: [...prev.topicos, novoTopico] }));
  };

  const atualizarTopico = (id, dados) => {
    setFormData(prev => ({
      ...prev,
      topicos: prev.topicos.map(t => t.id === id ? { ...t, ...dados } : t)
    }));
  };

  const removerTopico = (id) => {
    setFormData(prev => ({
      ...prev,
      topicos: prev.topicos.filter(t => t.id !== id)
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formData.topicos);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setFormData(prev => ({ ...prev, topicos: items }));
  };

  if (user?.role !== 'admin') return <div className="p-8 text-center text-red-600">Acesso restrito</div>;
  if (!escritorio) return <div className="p-8 text-center">Carregando...</div>;

  // Helper para notificar processamento de IA
  const notifyAIStart = (toolName) => {
    setAIProcessing({ active: true, tool: toolName, status: 'processing' });
  };

  const notifyAISuccess = (toolName) => {
    setAIProcessing({ active: true, tool: toolName, status: 'success' });
    setTimeout(() => setAIProcessing({ active: false, tool: '', status: 'idle' }), 2000);
  };

  const notifyAIError = () => {
    setAIProcessing({ active: false, tool: '', status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AIProcessingIndicator 
        isProcessing={aiProcessing.active} 
        toolName={aiProcessing.tool} 
        status={aiProcessing.status} 
      />
      
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/GestaoBlog')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {artigoId ? 'Editar Artigo' : 'Novo Artigo'}
                </h1>
                <p className="text-sm text-gray-500">{formData.topicos.length} tópico(s)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ScoreSEOLive formData={formData} />
              <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-2" />Preview
              </Button>
              <Button
                onClick={() => salvarMutation.mutate(formData)}
                disabled={salvarMutation.isPending || !formData.titulo}
                size="sm"
                className="min-w-[110px]"
              >
                {salvarMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb items={[
          { label: 'Marketing', url: createPageUrl('Marketing') },
          { label: 'Gestão Blog', url: createPageUrl('GestaoBlog') },
          { label: artigoId ? 'Editar Artigo' : 'Novo Artigo' }
        ]} />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4 xl:h-[calc(100vh-180px)]">
          <div className="xl:col-span-2 space-y-4 min-w-0 xl:overflow-y-auto xl:pr-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Digite o título do artigo"
                    className="text-lg font-semibold"
                  />
                </div>

                <TitulosAlternativosAI
                  tituloAtual={formData.titulo}
                  categoria={formData.categoria}
                  onAplicar={(titulo) => setFormData(prev => ({ ...prev, titulo }))}
                />

                <div>
                  <Label>Resumo</Label>
                  <Textarea
                    value={formData.resumo}
                    onChange={(e) => setFormData(prev => ({ ...prev, resumo: e.target.value }))}
                    placeholder="Breve resumo do artigo (150-160 caracteres)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Autor</Label>
                  <Input value={formData.autor} onChange={(e) => setFormData(prev => ({ ...prev, autor: e.target.value }))} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Conteúdo do Artigo</h3>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => adicionarTopico('h2')}>
                    <Plus className="w-4 h-4 mr-1" />H2
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => adicionarTopico('h3')}>
                    <Plus className="w-4 h-4 mr-1" />H3
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => adicionarTopico('paragrafo')}>
                    <Plus className="w-4 h-4 mr-1" />Parágrafo
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => adicionarTopico('lista')}>
                    <Plus className="w-4 h-4 mr-1" />Lista
                  </Button>
                </div>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="topicos">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {formData.topicos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>Nenhum tópico adicionado.</p>
                          <p className="text-sm mt-2">Clique nos botões acima para começar.</p>
                        </div>
                      ) : (
                        formData.topicos.map((topico, index) => (
                          <Draggable key={topico.id} draggableId={String(topico.id)} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps}>
                                <EditorTopicoInline
                                  topico={topico}
                                  onChange={(dados) => atualizarTopico(topico.id, dados)}
                                  onRemove={() => removerTopico(topico.id)}
                                  dragHandleProps={provided.dragHandleProps}
                                  titulo={formData.titulo}
                                  categoria={formData.categoria}
                                  keywords={formData.keywords}
                                  escritorioId={escritorio?.id}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Card>

            <DisclaimerPanel
              ativo={formData.disclaimer_ativo}
              texto={formData.disclaimer_texto}
              onChange={(dados) => setFormData(prev => ({ ...prev, ...dados }))}
            />
          </div>

          <div className="min-w-0 flex flex-col xl:h-full xl:overflow-hidden">
            <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="flex flex-col xl:h-full min-h-0">
              <TabsList className="grid w-full grid-cols-3 sticky top-16 xl:relative xl:top-0 z-40 bg-white flex-shrink-0 xl:rounded-t-lg">
                <TabsTrigger value="conteudo" className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm">
                  <FileText className="w-3 h-3 xl:w-4 xl:h-4" />
                  <span className="hidden sm:inline">Conteúdo</span>
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm">
                  <Search className="w-3 h-3 xl:w-4 xl:h-4" />
                  <span className="hidden sm:inline">SEO</span>
                </TabsTrigger>
                <TabsTrigger value="config" className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm">
                  <Settings className="w-3 h-3 xl:w-4 xl:h-4" />
                  <span className="hidden sm:inline">Config</span>
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4 mt-4 flex-1 min-h-0 xl:overflow-y-auto xl:pr-2">
                <TabsContent value="conteudo" className="space-y-4 mt-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-lg">🔥 Ferramentas Essenciais</h3>
                </div>
                <p className="text-sm text-blue-100">Comece por aqui - IA para criar conteúdo completo</p>
              </div>

              <GeradorArtigoCompleto
                artigoAtual={formData}
                onAplicarArtigo={(artigo) => {
                  setFormData(prev => ({ ...prev, ...artigo }));
                  notifyAISuccess('Artigo Completo');
                  toast.success('✨ Artigo completo aplicado com sucesso!');
                }}
                onProcessingStart={() => notifyAIStart('Artigo Completo')}
                onProcessingError={notifyAIError}
              />

              {(artigoId && formData.url_antiga) && (
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-amber-900">Reimportar de URL Original</h4>
                      <p className="text-xs text-amber-700 mt-1">Atualize o conteúdo com base na URL de origem</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-300 hover:bg-amber-100"
                      onClick={async () => {
                        notifyAIStart('Reimportação');
                        try {
                          const { data } = await base44.functions.invoke('importarArtigoExterno', { 
                            url: formData.url_antiga,
                            reimportar: true,
                            artigoId: artigoId
                          });
                          setFormData(prev => ({ 
                            ...prev, 
                            ...data.artigo,
                            id: artigoId 
                          }));
                          notifyAISuccess('Reimportação');
                          toast.success('✨ Conteúdo reimportado com sucesso!');
                        } catch (error) {
                          notifyAIError();
                          toast.error('Erro ao reimportar: ' + error.message);
                        }
                      }}
                    >
                      🔄 Reimportar
                    </Button>
                  </div>
                </Card>
              )}

              <GeradorTopicosIA
                artigoAtual={formData}
                onAplicarEstrutura={(estrutura) => {
                  if (!estrutura?.topicos) {
                    toast.error('❌ Estrutura inválida');
                    notifyAIError();
                    return;
                  }
                  setFormData(prev => ({ 
                    ...prev, 
                    titulo: estrutura.titulo || prev.titulo,
                    topicos: estrutura.topicos 
                  }));
                  notifyAISuccess('Estrutura de Tópicos');
                  toast.success('✨ Estrutura aplicada com sucesso!');
                }}
                onProcessingStart={() => notifyAIStart('Estrutura de Tópicos')}
                onProcessingError={notifyAIError}
              />

              <div className="border-t-2 border-gray-200 pt-4 mt-6">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-gray-50 border border-gray-200">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Ferramentas Avançadas de Conteúdo
                    </span>
                    <span className="text-xs text-gray-500 group-open:hidden">(clique para expandir)</span>
                  </summary>
                  <div className="space-y-4 mt-4 pb-4">

              <ReescritorTom
                topicos={formData.topicos}
                onAplicarReescrita={(topicos) => {
                  setFormData(prev => ({ ...prev, topicos }));
                  notifyAISuccess('Reescrita de Tom');
                  toast.success('✨ Tom reescrito com sucesso!');
                }}
                onProcessingStart={() => notifyAIStart('Reescrita de Tom')}
                onProcessingError={notifyAIError}
              />

              <GeradorFAQ
                titulo={formData.titulo}
                topicos={formData.topicos}
                onAdicionarFAQ={(faqTopicos) => {
                  setFormData(prev => ({
                    ...prev,
                    topicos: [...prev.topicos, ...faqTopicos]
                  }));
                }}
              />

              <LegibilidadeOtimizador 
                topicos={formData.topicos}
                onAplicarOtimizacao={(topicosOtimizados) => {
                  setFormData(prev => ({ ...prev, topicos: topicosOtimizados }));
                }}
              />

              <AnalisadorConteudoIA
                artigo={formData}
                onAplicarMelhorias={(melhorias) => {
                  setFormData(prev => ({ ...prev, ...melhorias }));
                  notifyAISuccess('Análise de Conteúdo');
                  toast.success('✨ Melhorias de conteúdo aplicadas!');
                }}
                onProcessingStart={() => notifyAIStart('Análise de Conteúdo')}
                onProcessingError={notifyAIError}
              />

              <SugestaoLinksInternos
                conteudo={formData.topicos.map(t => t.texto || '').join(' ')}
                keywords={formData.keywords}
                categoria={formData.categoria}
                escritorioId={escritorio?.id}
                artigoAtualId={artigoId}
                onInserirLink={(link) => {
                  const novoTopico = {
                    id: Date.now() + Math.random(),
                    tipo: 'paragrafo',
                    texto: link
                  };
                  setFormData(prev => ({ ...prev, topicos: [...prev.topicos, novoTopico] }));
                  toast.success('Link adicionado ao final do artigo');
                }}
              />

              <GeradorImagensIA
                titulo={formData.titulo}
                topicos={formData.topicos}
                onImagemGerada={(url, tipo) => {
                  if (tipo === 'capa') {
                    setFormData(prev => ({ ...prev, imagem_capa: url }));
                  }
                  toast.success('Imagem aplicada!');
                }}
              />

              <SugestorImagensContextuais
                titulo={formData.titulo}
                topicos={formData.topicos}
                onInserirImagem={(topicoId, url, alt) => {
                  const topicos = [...formData.topicos];
                  const indice = topicos.findIndex(t => t.id === topicoId);
                  if (indice !== -1) {
                    topicos.splice(indice + 1, 0, {
                      id: Date.now(),
                      tipo: 'paragrafo',
                      texto: `![${alt}](${url})`
                    });
                    setFormData(prev => ({ ...prev, topicos }));
                  }
                }}
              />

                  </div>
                </details>
              </div>
              </TabsContent>

                <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-5 h-5" />
                  <h3 className="font-bold text-lg">🎯 SEO Essencial</h3>
                </div>
                <p className="text-sm text-orange-100">Configure primeiro - elementos críticos para rankeamento</p>
              </div>

              <CategorizadorIA
                artigo={formData}
                escritorioId={escritorio?.id}
                onAplicar={(dados) => setFormData(prev => ({ ...prev, ...dados }))}
              />

              <SlugGeneratorAI
                titulo={formData.titulo}
                slugAtual={formData.slug}
                palavraChave={formData.keywords?.[0]}
                onChange={(slug, urlCanonica) => setFormData(prev => ({ ...prev, slug, url_canonica: urlCanonica }))}
              />

              <MetaDescriptionAI
                titulo={formData.titulo}
                resumo={formData.resumo}
                topicos={formData.topicos}
                metaAtual={formData.meta_description}
                onAplicar={(meta) => setFormData(prev => ({ ...prev, meta_description: meta }))}
              />

              <Card className="p-4">
                <Label>Imagem de Capa</Label>
                <Input
                  value={formData.imagem_capa}
                  onChange={(e) => setFormData(prev => ({ ...prev, imagem_capa: e.target.value }))}
                  placeholder="URL da imagem"
                  className="mt-2"
                />
                {formData.imagem_capa && (
                  <img 
                    src={formData.imagem_capa} 
                    alt="Preview" 
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
              </Card>

              {formData.imagem_capa && (
                <ImageAltGenerator
                  imagemUrl={formData.imagem_capa}
                  altAtual={formData.imagem_alt}
                  onChange={(alt) => setFormData(prev => ({ ...prev, imagem_alt: alt }))}
                />
              )}

              <Card className="p-4">
                <Label>Palavras-chave</Label>
                <Input
                  value={formData.keywords.join(', ')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                  }))}
                  placeholder="palavra1, palavra2, palavra3"
                  className="mt-2"
                />
              </Card>

              <div className="border-t-2 border-gray-200 pt-4 mt-6">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-gray-50 border border-gray-200">
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Ferramentas SEO Avançadas
                    </span>
                    <span className="text-xs text-gray-500 group-open:hidden">(clique para expandir)</span>
                  </summary>
                  <div className="space-y-4 mt-4 pb-4">

              <IntencaoBuscaAplicador
                keywords={formData.keywords}
                escritorioId={escritorio?.id}
                artigoAtualId={artigoId}
              />

              <AssistenteSEOGaps
                artigo={formData}
                onAplicarCorrecoes={(correcoes) => {
                  setFormData(prev => ({ ...prev, ...correcoes }));
                  notifyAISuccess('Correções SEO');
                  toast.success('✨ Gaps de SEO corrigidos!');
                }}
                onProcessingStart={() => notifyAIStart('Análise de Gaps SEO')}
                onProcessingError={notifyAIError}
              />

              {artigoId && (
                <OtimizadorAvancadoV2
                  artigo={{ ...formData, id: artigoId }}
                  onAplicar={(dados) => setFormData(prev => ({ ...prev, ...dados }))}
                />
              )}

              {artigoId && (
                <OtimizacaoRapida
                  artigo={{ ...formData, id: artigoId }}
                  onAplicar={(dados) => {
                    setFormData(prev => ({ ...prev, ...dados }));
                    notifyAISuccess('Otimização 1-Click');
                    toast.success('✨ Otimização rápida aplicada!');
                  }}
                  onProcessingStart={() => notifyAIStart('Otimização 1-Click')}
                  onProcessingError={notifyAIError}
                />
              )}

              <ReferenciasAprimoradas
                referencias={formData.referencias}
                titulo={formData.titulo}
                topicos={formData.topicos}
                onChange={(refs) => setFormData(prev => ({ ...prev, referencias: refs }))}
              />

              {artigoId && (
                <ABTestingAvancado artigo={{ ...formData, id: artigoId }} />
              )}

              <AssistenteIAAvancado
                artigo={formData}
                onAplicar={(dados) => {
                  if (dados.titulo) {
                    setFormData(prev => ({ ...prev, titulo: dados.titulo }));
                  }
                  if (dados.novoTopico) {
                    const topicos = [...formData.topicos];
                    topicos.splice(dados.posicao || topicos.length, 0, dados.novoTopico);
                    setFormData(prev => ({ ...prev, topicos }));
                  }
                  toast.success('Aplicado!');
                }}
              />

              {artigoId && (
                <HistoricoVersoes
                  artigoId={artigoId}
                  onRestaurar={(dados) => {
                    setFormData(prev => ({
                      ...prev,
                      titulo: dados.titulo,
                      topicos: dados.topicos,
                      meta_description: dados.meta_description,
                      keywords: dados.keywords
                    }));
                    toast.success('Versão restaurada! Salve para confirmar.');
                  }}
                />
              )}

                  </div>
                </details>
              </div>
              </TabsContent>

                <TabsContent value="config" className="space-y-4 mt-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800">
                <strong>Configurações de Publicação</strong> - Status e metadados
              </div>

              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Status do Artigo</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rascunho">Rascunho</SelectItem>
                        <SelectItem value="revisao">Em Revisão</SelectItem>
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="publicado">Publicado</SelectItem>
                        <SelectItem value="arquivado">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Data de Publicação</Label>
                    <Input
                      type="datetime-local"
                      value={formData.data_publicacao ? new Date(formData.data_publicacao).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        data_publicacao: e.target.value ? new Date(e.target.value).toISOString() : null,
                        status: e.target.value && new Date(e.target.value) > new Date() ? 'agendado' : prev.status
                      }))}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.data_publicacao && new Date(formData.data_publicacao) > new Date() 
                        ? '📅 Agendado para o futuro' 
                        : formData.data_publicacao 
                        ? '✅ Já publicado' 
                        : 'Sem data definida'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="publicado"
                      checked={formData.publicado}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        publicado: e.target.checked,
                        data_publicacao: e.target.checked && !prev.data_publicacao ? new Date().toISOString() : prev.data_publicacao,
                        status: e.target.checked ? 'publicado' : prev.status
                      }))}
                      className="rounded"
                    />
                    <Label htmlFor="publicado" className="cursor-pointer">Publicar imediatamente</Label>
                  </div>

                  <div>
                    <Label>URL Canônica</Label>
                    <Input
                      value={formData.url_canonica}
                      onChange={(e) => setFormData(prev => ({ ...prev, url_canonica: e.target.value }))}
                      placeholder="https://hermidamaia.adv.br/blog/slug-do-artigo"
                      className="mt-2"
                      disabled
                    />
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <span>✅</span>
                      <span>Gerado automaticamente com base no slug</span>
                    </p>
                  </div>
                </div>
              </Card>

              {artigoId && (
                <NarradorAudio
                  artigo={{ ...formData, id: artigoId }}
                  onAudioGerado={(url) => setFormData(prev => ({ ...prev, audio_narrador_url: url }))}
                />
              )}

              {artigoId && (
                <ArtigosRelacionadosManager
                  artigoId={artigoId}
                  categoria={formData.categoria}
                  escritorioId={escritorio?.id}
                />
              )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        </div>

        <PreviewModal 
        open={showPreview} 
        onClose={() => setShowPreview(false)} 
        artigo={{ ...formData, id: artigoId }}
        />
        </div>
        );
        }