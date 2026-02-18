import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Sparkles, TrendingUp, Target, Zap } from "lucide-react";

const roadmapData = [
  {
    fase: "✅ FASE 1: CORREÇÕES URGENTES",
    status: "concluida",
    prioridade: "concluida",
    items: [
      {
        titulo: "✅ Redator IA - Melhorias Críticas",
        descricao: "Prompt CTR 8%+, análise concorrentes gaps sutis, keywords LSI contextual",
        status: "concluido",
        impacto: "alto",
        esforco: "médio"
      },
      {
        titulo: "✅ Meta Tags Automáticas",
        descricao: "meta_description, keywords, og:title, og:description, twitter:title via IA",
        status: "concluido",
        impacto: "alto",
        esforco: "baixo"
      },
      {
        titulo: "✅ Editor Markdown Avançado",
        descricao: "Preview lado a lado, atalhos Ctrl+B/I/K, toolbar completo, word count",
        status: "concluido",
        impacto: "médio",
        esforco: "médio"
      },
      {
        titulo: "✅ Sugestões SEO em Tempo Real",
        descricao: "Score 0-100, densidade keywords, legibilidade Flesch, checks validados",
        status: "concluido",
        impacto: "alto",
        esforco: "médio"
      }
    ]
  },
  {
    fase: "✅ FASE 2: SEO PROFISSIONAL",
    status: "concluida",
    prioridade: "concluida",
    items: [
      {
        titulo: "✅ Pesquisa de Palavras-Chave",
        descricao: "✅ Simulação Google KW Planner, volume/CPC/dificuldade, LSI jurídico, PAA, long-tail transacional",
        status: "concluido",
        impacto: "alto",
        esforco: "alto"
      },
      {
        titulo: "✅ Análise Competitiva",
        descricao: "✅ TOP 3 concorrentes, DA/backlinks, estrutura H2/H3, gaps sutis, tom, CTAs, storytelling, proof",
        status: "concluido",
        impacto: "alto",
        esforco: "alto"
      },
      {
        titulo: "✅ Auditoria SEO Automática",
        descricao: "✅ H2/H3, links internos/externos, velocidade, meta tags, diff visual, aprovação individual/auto",
        status: "concluido",
        impacto: "médio",
        esforco: "alto"
      },
      {
        titulo: "❌ Tracking de Ranking",
        descricao: "❌ NÃO IMPLEMENTADO - Monitoramento real posições Google (necessita API Search Console)",
        status: "pendente",
        impacto: "médio",
        esforco: "alto"
      },
      {
        titulo: "✅ Backlinks Manager",
        descricao: "✅ CRUD portais mídia, DA tracking, stats consolidadas, busca notícias IA, exibição Home",
        status: "concluido",
        impacto: "médio",
        esforco: "médio"
      }
    ]
  },
  {
    fase: "✅ FASE 3: REDATOR IA 2.0",
    status: "concluida",
    prioridade: "concluida",
    items: [
      {
        titulo: "✅ Templates de Conteúdo",
        descricao: "✅ 5 templates: Blog post, Landing page, Produto, FAQ schema, Case study storytelling",
        status: "concluido",
        impacto: "alto",
        esforco: "médio"
      },
      {
        titulo: "✅ Geração de Meta Tags",
        descricao: "✅ JÁ EXISTIA (MetaTagsGenerator) - meta_description, keywords, og:tags, twitter:card",
        status: "concluido",
        impacto: "alto",
        esforco: "baixo"
      },
      {
        titulo: "✅ Social Media Content",
        descricao: "✅ 5 plataformas: Instagram (caption+hashtags), Twitter (threads), LinkedIn, Facebook, Quora",
        status: "concluido",
        impacto: "médio",
        esforco: "médio"
      },
      {
        titulo: "✅ Ad Copy Generator",
        descricao: "✅ 4 canais: Google Search, Google Display, Facebook/Instagram, LinkedIn + keywords negativas",
        status: "concluido",
        impacto: "médio",
        esforco: "médio"
      },
      {
        titulo: "✅ Reescrita Inteligente",
        descricao: "✅ JÁ EXISTIA (OtimizadorConteudo) - Auditoria + diff visual + aprovações + reescrita real",
        status: "concluido",
        impacto: "alto",
        esforco: "baixo"
      }
    ]
  },
  {
    fase: "FASE 4: FERRAMENTAS PREMIUM",
    status: "futura",
    prioridade: "média",
    items: [
      {
        titulo: "✅ Gerador de Imagens IA",
        descricao: "✅ FUNCIONAL - GeradorImagensIA.jsx (Core.GenerateImage, mutation real, 4 estilos preset, download, copy URL) - Integrado MarketingHub tab 'images'",
        status: "concluido",
        impacto: "alto",
        esforco: "médio"
      },
      {
        titulo: "❌ Editor Visual Avançado",
        descricao: "❌ NÃO IMPLEMENTADO - Temos MarkdownEditor básico (toolbar + preview), mas SEM drag-drop tipo Notion/Gutenberg - Necessita editor visual com blocos",
        status: "pendente",
        impacto: "médio",
        esforco: "alto"
      },
      {
        titulo: "❌ Análise de Sentimento",
        descricao: "❌ NÃO IMPLEMENTADO - Sem detecção de tom (positivo/negativo/neutro) - Necessita integração API sentiment analysis (IBM Tone Analyzer ou similar)",
        status: "pendente",
        impacto: "baixo",
        esforco: "médio"
      },
      {
        titulo: "❌ Tradutor Automático",
        descricao: "❌ NÃO IMPLEMENTADO - Blog não suporta multi-idioma - Necessita entity Blog com campo 'idioma', tradução via LLM, UI seletor idiomas",
        status: "pendente",
        impacto: "médio",
        esforco: "médio"
      }
    ]
  },
  {
    fase: "✅ FASE 4: EMAIL INBOUND (CONCLUÍDA)",
    status: "concluida",
    prioridade: "concluida",
    items: [
      {
        titulo: "✅ SendGrid Inbound Parse",
        descricao: "✅ Webhook receiveEmail funcional, parser HTML→texto limpo, detecção threads (Re: + ticket ID), categoria email_inbound",
        status: "concluido",
        impacto: "alto",
        esforco: "médio"
      },
      {
        titulo: "✅ Thread Detection",
        descricao: "✅ Identifica respostas (Re: ou [ticket-ID]), adiciona mensagem ao ticket existente, atualiza status automaticamente",
        status: "concluido",
        impacto: "alto",
        esforco: "médio"
      },
      {
        titulo: "✅ Anexos de Email",
        descricao: "✅ Entity TicketMensagem.anexos (array), parser processa attachments SendGrid, nome/tipo/url salvos",
        status: "concluido",
        impacto: "médio",
        esforco: "baixo"
      },
      {
        titulo: "🟡 Upload Real Anexos",
        descricao: "🟡 PARCIAL - Anexos detectados mas URL null (necessita SendGrid Inbound Parse config adicional para CDN)",
        status: "em_andamento",
        impacto: "médio",
        esforco: "baixo"
      }
    ]
  },
  {
    fase: "FASE 5: AUTOMAÇÃO AVANÇADA",
    status: "em_andamento",
    prioridade: "baixa",
    items: [
      {
        titulo: "✅ Pipeline de Conteúdo",
        descricao: "✅ FUNCIONAL - Blog entity tem status workflow (rascunho→revisao→agendado→publicado→arquivado), campos revisado_por + data_revisao implementados, GestaoBlog gerencia fluxo",
        status: "concluido",
        impacto: "alto",
        esforco: "alto"
      },
      {
        titulo: "🟡 Content Calendar",
        descricao: "🟡 PARCIAL - Blog entity tem data_agendamento funcional, mas SEM UI calendário visual (necessita componente Calendar view tipo Google Calendar para drag-drop agendamento)",
        status: "em_andamento",
        impacto: "médio",
        esforco: "médio"
      },
      {
        titulo: "❌ Distribution Automática",
        descricao: "❌ NÃO IMPLEMENTADO - Sem auto-posting redes sociais (necessita integração Buffer/Ayrshare API ou hooks LinkedIn/Slack connectors já autorizados)",
        status: "pendente",
        impacto: "médio",
        esforco: "alto"
      },
      {
        titulo: "✅ Performance Dashboard",
        descricao: "✅ FUNCIONAL - BlogAnalytics.jsx (total views, artigos 30d, média views/artigo, top 5 mais lidos) - Integrado em GestaoBlog + Analytics consolidado",
        status: "concluido",
        impacto: "alto",
        esforco: "alto"
      }
    ]
  }
];

export default function RoadmapMarketing() {
  const [faseExpandida, setFaseExpandida] = useState("FASE 1: CORREÇÕES URGENTES");

  const getStatusIcon = (status) => {
    switch (status) {
      case "concluido": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "em_andamento": return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case "crítica": return "bg-red-100 text-red-800";
      case "alta": return "bg-orange-100 text-orange-800";
      case "média": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactoColor = (impacto) => {
    switch (impacto) {
      case "alto": return "text-red-600";
      case "médio": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roadmap Marketing & SEO</h1>
          <p className="text-gray-600 mt-2">Plano de evolução do sistema de conteúdo e automação</p>
        </div>
        <Button className="bg-[var(--brand-primary)]">
          <Sparkles className="w-4 h-4 mr-2" />
          Sugerir Feature
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <Target className="w-8 h-8 mb-2 text-[var(--brand-primary)]" />
          <div className="text-2xl font-bold">
            {roadmapData.reduce((acc, fase) => acc + fase.items.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Features Planejadas</div>
        </Card>

        <Card className="p-4">
          <CheckCircle2 className="w-8 h-8 mb-2 text-green-600" />
          <div className="text-2xl font-bold">
            {roadmapData.reduce((acc, fase) => 
              acc + fase.items.filter(i => i.status === "concluido").length, 0
            )}
          </div>
          <div className="text-sm text-gray-600">Concluídas</div>
        </Card>

        <Card className="p-4">
          <Clock className="w-8 h-8 mb-2 text-blue-600" />
          <div className="text-2xl font-bold">
            {roadmapData.reduce((acc, fase) => 
              acc + fase.items.filter(i => i.status === "em_andamento").length, 0
            )}
          </div>
          <div className="text-sm text-gray-600">Em Desenvolvimento</div>
        </Card>

        <Card className="p-4">
          <TrendingUp className="w-8 h-8 mb-2 text-purple-600" />
          <div className="text-2xl font-bold">
            {Math.round((roadmapData.reduce((acc, fase) => 
              acc + fase.items.filter(i => i.status === "concluido").length, 0
            ) / roadmapData.reduce((acc, fase) => acc + fase.items.length, 0)) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Progresso Total</div>
        </Card>
      </div>

      <div className="space-y-4">
        {roadmapData.map((fase) => (
          <Card key={fase.fase} className="overflow-hidden">
            <div
              className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-colors"
              onClick={() => setFaseExpandida(faseExpandida === fase.fase ? null : fase.fase)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(fase.status)}
                  <div>
                    <h3 className="font-bold text-lg">{fase.fase}</h3>
                    <p className="text-sm text-gray-600">
                      {fase.items.filter(i => i.status === "concluido").length}/{fase.items.length} concluídas
                    </p>
                  </div>
                </div>
                <Badge className={getPrioridadeColor(fase.prioridade)}>
                  {fase.prioridade}
                </Badge>
              </div>
            </div>

            {faseExpandida === fase.fase && (
              <div className="p-4 space-y-3 border-t">
                {fase.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.titulo}</h4>
                        <Zap className={`w-4 h-4 ${getImpactoColor(item.impacto)}`} />
                      </div>
                      <p className="text-sm text-gray-600">{item.descricao}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Impacto: {item.impacto}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Esforço: {item.esforco}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}