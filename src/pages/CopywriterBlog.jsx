import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Brain, Sparkles, FileText, TrendingUp, Calendar, Image, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AIPromptConfig from "@/components/blog/copywriter/AIPromptConfig";
import AIPreview from "@/components/blog/copywriter/AIPreview";
import GeradorImagensIA from "@/components/marketing/GeradorImagensIA";
import OtimizadorConteudo from "@/components/marketing/OtimizadorConteudo";

export default function CopywriterBlog() {
  const [gerando, setGerando] = useState(false);
  const [pesquisando, setPesquisando] = useState(false);
  const [artigoPreview, setArtigoPreview] = useState(null);
  const [sugestoesTopicos, setSugestoesTopicos] = useState(null);
  const [imagemCapa, setImagemCapa] = useState(null);
  const [config, setConfig] = useState({
    topico: "",
    tom: "profissional",
    publico: "leigos",
    analisarConcorrentes: true,
    incluirEstatisticas: true
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

  const { data: artigos = [] } = useQuery({
    queryKey: ['blog-stats'],
    queryFn: () => base44.entities.Blog.filter({ escritorio_id: escritorio?.id }, '-created_date', 10),
    enabled: !!escritorio
  });

  const pesquisarTopicos = async () => {
    setPesquisando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `PESQUISA ESTRATÉGICA - Sugestões de Artigos Vencedores

CONTEXTO: Blog jurídico - Direito do Consumidor e Superendividamento no Brasil

MISSÃO: Identificar 5 tópicos de alto potencial para ranquear no Google

CRITÉRIOS OBRIGATÓRIOS:
1. Volume de busca médio/alto (500+ buscas/mês)
2. Concorrência média/baixa (chance real de ranquear)
3. Intenção comercial (potencial de conversão)
4. Relevância para público-alvo (consumidores endividados)

ANÁLISE COMPLETA PARA CADA TÓPICO:

1. Título sugerido (60-70 chars, otimizado CTR)
2. Volume de busca estimado/mês
3. Dificuldade SEO (1-10, onde 1=fácil)
4. Palavras-chave relacionadas (5 LSI keywords)
5. Ângulo único (diferencial vs concorrentes)
6. Tipo de conteúdo ideal (guia completo/lista/comparação)
7. Score de oportunidade (0-100)

EVITE: Tópicos saturados ("como renegociar dívidas" genérico)
PREFIRA: Long-tail específico ("como renegociar FGTS consignado em 2024")`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            topicos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  volume_busca: { type: "number" },
                  dificuldade_seo: { type: "number" },
                  keywords_relacionadas: { type: "array", items: { type: "string" } },
                  angulo_unico: { type: "string" },
                  tipo_conteudo: { type: "string" },
                  score_oportunidade: { type: "number" }
                }
              }
            }
          }
        }
      });
      setSugestoesTopicos(resultado.topicos);
      toast.success("5 tópicos vencedores identificados!");
    } catch (e) {
      toast.error(`Erro na pesquisa: ${e?.message}`);
    } finally {
      setPesquisando(false);
    }
  };

  const gerarArtigo = async () => {
    if (!config.topico.trim()) {
      toast.error("Defina um tópico para o artigo");
      return;
    }

    setGerando(true);
    setArtigoPreview(null);
    
    try {
      const prompt = `Você é um especialista SENIOR em Marketing de Conteúdo Jurídico, Copywriting SEO e Direito do Consumidor no Brasil.

🎯 MISSÃO: Criar artigo RANK #1 no Google sobre: "${config.topico}"

📊 FASE 1: PESQUISA & ANÁLISE (OBRIGATÓRIO)
${config.analisarConcorrentes ? `
1. Analise os TOP 3 artigos ranqueando para esta palavra-chave
2. Identifique gaps de conteúdo (o que eles NÃO cobrem)
3. Encontre 10 palavras-chave LSI (Latent Semantic Indexing)
4. Liste 5 perguntas frequentes (People Also Ask)
5. Identifique palavras-chave long-tail relacionadas` : ''}

${config.incluirEstatisticas ? `
6. Busque estatísticas REAIS e atualizadas (2023-2024)
7. Inclua dados do IBGE, Serasa, Banco Central se relevante
8. Cite fontes oficiais e jurisprudência recente` : ''}

📝 FASE 2: ESTRUTURA SEO-OPTIMIZED
1. **Título Principal (H1)**
   - 60-70 caracteres
   - Incluir palavra-chave primária
   - Formato: [Número] + [Benefício] + [Palavra-chave] + [Ano]
   - Ex: "7 Passos Para Renegociar Dívidas Bancárias em 2024"

2. **Meta Description** (150-160 chars)
   - CTA claro
   - Palavra-chave nos primeiros 120 chars
   - Benefit-driven (não feature-driven)

3. **Introdução** (150-200 palavras)
   - Hook emocional (problema que leitor enfrenta)
   - Estatística impactante
   - Promise clara (o que aprenderá)
   - Palavra-chave nos primeiros 100 caracteres

4. **Corpo do Artigo** (800-1200 palavras)
   - 4-6 seções H2 com palavras-chave LSI
   - Cada seção H2: 150-250 palavras
   - H3 para subtópicos detalhados
   - Tabelas comparativas quando aplicável
   - Listas numeradas (melhor para featured snippets)
   - Boxes de destaque com dicas práticas
   - Citações de especialistas/legislação

5. **Conclusão** (100-150 palavras)
   - Resumo dos pontos principais
   - CTA forte (agendar consulta/download material)
   - Palavra-chave de fechamento

6. **FAQ Schema** (5-8 perguntas)
   - Formato pergunta/resposta curta
   - Otimizado para rich snippets

📌 REQUISITOS SEO TÉCNICOS:
- Densidade palavra-chave: 1-2%
- LSI keywords: mínimo 10 variações naturais
- Links internos: sugerir 3-5 artigos relacionados
- Readability: Flesch Reading Ease > 60
- Parágrafos: máximo 3-4 linhas
- Frases: máximo 20 palavras
- Voz ativa: 80%+ das sentenças

🎭 TOM & ESTILO:
- Tom: ${config.tom === 'profissional' ? 'Profissional mas HUMANO (evite juridiquês)' : config.tom === 'acessivel' ? 'Conversacional, como explicar para um amigo' : 'Técnico-jurídico com exemplos práticos'}
- Público: ${config.publico === 'leigos' ? 'Pessoas físicas SEM conhecimento jurídico (ELI5)' : config.publico === 'advogados' ? 'Advogados (pode usar termos técnicos)' : 'Empresários (foco ROI e resultados)'}
- Storytelling: incluir 1-2 casos reais (anonimizados)
- Credibilidade: citar Lei 14.181/2021, CDC, jurisprudência

⚡ ELEMENTOS DE CONVERSÃO:
- 2-3 CTAs ao longo do texto
- Social proof (casos de sucesso)
- Senso de urgência (quando ético)
- Prova de autoridade (anos experiência, casos ganhos)

🏆 CHECKLIST FINAL:
✅ Título otimizado para CTR
✅ Meta description persuasiva
✅ Introdução com gancho emocional
✅ H2/H3 com palavras-chave LSI
✅ Listas e tabelas (scannable)
✅ FAQ para featured snippets
✅ Estatísticas com fontes
✅ CTAs estratégicos
✅ Links internos sugeridos
✅ Tags SEO (10-15 keywords)

FORMATO DE SAÍDA JSON:
{
  "titulo": "título H1 otimizado",
  "resumo": "resumo curto para cards",
  "meta_description": "meta description 150-160 chars",
  "keywords": ["palavra-chave-1", "LSI-2", ...],
  "conteudo": "artigo completo em Markdown",
  "categoria": "superendividamento|direito_consumidor|negociacao_dividas",
  "tags": ["tag1", "tag2", ...],
  "seo_score_estimado": 85,
  "palavras_chave_lsi": ["termo1", "termo2", ...],
  "faq_sugerido": [
    {"pergunta": "...", "resposta": "..."}
  ]
}`;

      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            resumo: { type: "string" },
            conteudo: { type: "string" },
            categoria: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            meta_description: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            seo_score_estimado: { type: "number" },
            palavras_chave_lsi: { type: "array", items: { type: "string" } },
            faq_sugerido: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  pergunta: { type: "string" },
                  resposta: { type: "string" }
                }
              }
            }
          }
        }
      });

      const novoArtigo = await base44.entities.Blog.create({
        titulo: resultado.titulo,
        resumo: resultado.resumo,
        conteudo: resultado.conteudo,
        categoria: resultado.categoria || "direito_consumidor",
        tags: resultado.tags || [],
        meta_description: resultado.meta_description,
        keywords: resultado.keywords || [],
        imagem_capa: imagemCapa || undefined,
        autor: "Dr. Adriano Hermida Maia",
        autor_cargo: "Especialista em Direito do Consumidor",
        status: "rascunho",
        publicado: false,
        visualizacoes: 0,
        escritorio_id: escritorio.id,
        gerado_por_ia: true,
        prompt_ia: config.topico
      });

      setArtigoPreview(novoArtigo);
      setImagemCapa(null);
      toast.success("Artigo completo gerado! Revise no painel de Gestão");
    } catch (e) {
      console.error("Erro:", e);
      toast.error(`Erro ao gerar: ${e?.message || String(e)}`);
    } finally {
      setGerando(false);
    }
  };

  if (user?.role !== 'admin') return <div className="p-8 text-center text-red-600">Acesso restrito</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Copywriter IA</h1>
        <p className="text-gray-600">Geração automática de artigos</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <FileText className="w-8 h-8 mb-2 text-[var(--brand-primary)]" />
          <div className="text-3xl font-bold">{artigos.length}</div>
          <div className="text-sm text-gray-600">Artigos Publicados</div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <TrendingUp className="w-8 h-8 mb-2 text-green-600" />
          <div className="text-3xl font-bold">
            {artigos.reduce((acc, a) => acc + (a.visualizacoes || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Visualizações Totais</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <Calendar className="w-8 h-8 mb-2 text-orange-600" />
          <div className="text-3xl font-bold">
            {artigos.filter(a => new Date(a.created_date).toDateString() === new Date().toDateString()).length}
          </div>
          <div className="text-sm text-gray-600">Publicados Hoje</div>
        </div>
      </div>

      <Tabs defaultValue="pesquisar" className="bg-white rounded-xl shadow p-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pesquisar">
            <Search className="w-4 h-4 mr-2" />
            Pesquisar Tópicos
          </TabsTrigger>
          <TabsTrigger value="gerar">
            <Sparkles className="w-4 h-4 mr-2" />
            Gerar Artigo
          </TabsTrigger>
          <TabsTrigger value="otimizar">
            <TrendingUp className="w-4 h-4 mr-2" />
            Otimizar Existentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pesquisar">
          <div className="text-center mb-6">
            <Search className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <h3 className="text-xl font-bold mb-2">Pesquisa Estratégica de Tópicos</h3>
            <p className="text-gray-600">IA analisa volume de busca, concorrência e oportunidades</p>
          </div>

          <Button
            onClick={pesquisarTopicos}
            disabled={pesquisando}
            className="w-full mb-6"
            size="lg"
          >
            {pesquisando ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Pesquisando...
              </>
            ) : (
              <><Search className="w-5 h-5 mr-2" />Pesquisar Tópicos Vencedores</>
            )}
          </Button>

          {sugestoesTopicos && (
            <div className="space-y-4">
              {sugestoesTopicos.map((topico, i) => (
                <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg flex-1">{topico.titulo}</h4>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{topico.score_oportunidade}</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="font-semibold text-blue-900">{topico.volume_busca}</div>
                      <div className="text-xs text-blue-600">buscas/mês</div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded">
                      <div className="font-semibold text-orange-900">{topico.dificuldade_seo}/10</div>
                      <div className="text-xs text-orange-600">dificuldade</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-semibold text-purple-900 capitalize">{topico.tipo_conteudo}</div>
                      <div className="text-xs text-purple-600">formato</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2"><strong>Ângulo:</strong> {topico.angulo_unico}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {topico.keywords_relacionadas.map((kw, j) => (
                      <span key={j} className="text-xs bg-gray-100 px-2 py-1 rounded">{kw}</span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setConfig({ ...config, topico: topico.titulo });
                      document.querySelector('[value="gerar"]')?.click();
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Usar este Tópico
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gerar">
          <div className="text-center mb-6">
            <Brain className="w-12 h-12 mx-auto mb-3 text-[var(--brand-primary)]" />
            <h3 className="text-xl font-bold mb-2">Gerador de Artigos IA</h3>
            <p className="text-gray-600">Redação profissional + SEO + Imagem de capa</p>
          </div>

          <AIPromptConfig config={config} onChange={setConfig} />

          <div className="my-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Image className="w-4 h-4 text-purple-600" />
              Imagem de Capa (Opcional)
            </h4>
            <GeradorImagensIA onImageGenerated={setImagemCapa} />
            {imagemCapa && (
              <div className="mt-3">
                <img src={imagemCapa} alt="Preview" className="w-full rounded-lg border" />
              </div>
            )}
          </div>
          
          <Button
            onClick={gerarArtigo}
            disabled={gerando || !config.topico.trim()}
            className="w-full bg-[var(--brand-primary)]"
            size="lg"
          >
            {gerando ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Gerando Artigo Completo...
              </>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" />Gerar Artigo + Imagem</>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="otimizar">
          <div className="text-center mb-6">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-orange-600" />
            <h3 className="text-xl font-bold mb-2">Otimização Contínua</h3>
            <p className="text-gray-600">Analise e melhore artigos já publicados</p>
          </div>

          <div className="space-y-6">
            {artigos.slice(0, 3).map(artigo => (
              <div key={artigo.id} className="border rounded-lg p-4">
                <h4 className="font-bold mb-2">{artigo.titulo}</h4>
                <div className="text-sm text-gray-600 mb-3">
                  {artigo.visualizacoes || 0} visualizações • {new Date(artigo.data_publicacao).toLocaleDateString()}
                </div>
                <OtimizadorConteudo artigo={artigo} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {artigoPreview && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Preview do Artigo Gerado</h3>
          <AIPreview artigo={artigoPreview} />
        </div>
      )}
    </div>
  );
}