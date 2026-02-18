import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Users, DollarSign, Sparkles, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default React.memo(function FunilComGraficos({ escritorioId }) {
  const [analisando, setAnalisando] = useState(false);
  const [analise, setAnalise] = useState(null);
  const navigate = useNavigate();

  const { data: artigos = [], isLoading: loadingArtigos } = useQuery({
    queryKey: ['blog-artigos', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return base44.entities.Blog.filter({ escritorio_id: escritorioId, publicado: true });
    },
    enabled: !!escritorioId,
    retry: 3,
    staleTime: 5 * 60 * 1000
  });

  const { data: leads = [], isLoading: loadingLeads } = useQuery({
    queryKey: ['leads', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return base44.entities.Lead.filter({ escritorio_id: escritorioId });
    },
    enabled: !!escritorioId,
    retry: 3,
    staleTime: 5 * 60 * 1000
  });

  if (loadingArtigos || loadingLeads) {
    return <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />;
  }

  if (!artigos.length) return null;

  const analisarFunil = async () => {
    setAnalisando(true);
    try {
      const totalVisitas = artigos.reduce((acc, art) => acc + (art.visualizacoes || 0), 0);
      const totalLeads = leads.length;
      const leadsConvertidos = leads.filter(l => l.status === 'ganho').length;

      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `ANÁLISE DE FUNIL DE VENDAS - Blog Jurídico

DADOS ATUAIS:
- Total Artigos: ${artigos.length}
- Total Visitas: ${totalVisitas}
- Leads Gerados: ${totalLeads}
- Leads Convertidos: ${leadsConvertidos}

CALCULE:

1. FUNIL DE CONVERSÃO:
   - Visitantes → Leads (taxa %)
   - Leads → Clientes (taxa %)
   - Onde estão as MAIORES PERDAS?

2. ROI POR ARTIGO:
   - Artigos ToFu (quantos, views, leads gerados)
   - Artigos MoFu (quantos, conversão)
   - Artigos BoFu (quantos, vendas diretas)

3. GAPS ESTRATÉGICOS:
   - Keywords com alto volume SEM artigo
   - Funil com artigos faltantes (ToFu→MoFu→BoFu)
   - Tópicos com baixa conversão

4. NOVOS ARTIGOS SUGERIDOS (com ROI estimado):
   - Título sugerido
   - Tipo (ToFu/MoFu/BoFu)
   - ROI estimado (visitantes/mês, leads/mês, receita potencial)
   - Investimento necessário (tempo, recursos)

Retorne JSON estruturado com métricas ACIONÁVEIS.`,
        response_json_schema: {
          type: "object",
          properties: {
            funil: {
              type: "object",
              properties: {
                visitantes: { type: "number" },
                leads: { type: "number" },
                clientes: { type: "number" },
                taxa_visita_lead: { type: "number" },
                taxa_lead_cliente: { type: "number" },
                ponto_maior_perda: { type: "string" }
              }
            },
            distribuicao_funil: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipo: { type: "string" },
                  quantidade: { type: "number" },
                  views: { type: "number" },
                  leads: { type: "number" }
                }
              }
            },
            gaps_estrategicos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  volume: { type: "number" },
                  tipo_faltante: { type: "string" },
                  impacto: { type: "string" }
                }
              }
            },
            artigos_sugeridos_roi: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  tipo_funil: { type: "string" },
                  keywords: { type: "array", items: { type: "string" } },
                  estrutura_h2: { type: "array", items: { type: "string" } },
                  roi_visitantes_mes: { type: "number" },
                  roi_leads_mes: { type: "number" },
                  roi_receita_potencial: { type: "number" },
                  tempo_criacao_horas: { type: "number" },
                  prioridade_negocio: { type: "string" }
                }
              }
            }
          }
        }
      });

      setAnalise(resultado);
      toast.success('Análise de funil completa!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao analisar funil');
    } finally {
      setAnalisando(false);
    }
  };

  const criarArtigoROI = async (artigo) => {
    try {
      const topicosIniciais = artigo.estrutura_h2?.map((h2, i) => ({
        id: Date.now() + i * 2,
        tipo: 'h2',
        texto: h2
      })) || [];

      const dados = {
        titulo: artigo.titulo,
        categoria: 'direito_consumidor',
        keywords: artigo.keywords || [],
        topicos: topicosIniciais,
        status: 'rascunho',
        escritorio_id: escritorioId
      };

      const novoArtigo = await base44.entities.Blog.create(dados);
      toast.success('Artigo com ROI criado!');
      setTimeout(() => navigate(`/EditorBlog?id=${novoArtigo.id}`), 800);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar artigo');
    }
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Análise de Funil & ROI</h2>
          <p className="text-sm text-gray-600">Identifique gaps e oportunidades de conversão</p>
        </div>
        <Button onClick={analisarFunil} disabled={analisando}>
          <Sparkles className={`w-4 h-4 mr-2 ${analisando ? 'animate-pulse' : ''}`} />
          {analisando ? 'Analisando...' : 'Analisar Funil'}
        </Button>
      </div>

      {analise && (
        <div className="space-y-6">
          {/* Funil de Conversão Visual */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-4">Funil de Conversão</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { nome: 'Visitantes', valor: analise.funil?.visitantes || 0 },
                  { nome: 'Leads', valor: analise.funil?.leads || 0 },
                  { nome: 'Clientes', valor: analise.funil?.clientes || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#10b981">
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Visitantes → Leads:</span>
                  <Badge className="bg-green-600 text-white">
                    {analise.funil?.taxa_visita_lead?.toFixed(2)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Leads → Clientes:</span>
                  <Badge className="bg-orange-600 text-white">
                    {analise.funil?.taxa_lead_cliente?.toFixed(2)}%
                  </Badge>
                </div>
                <div className="bg-red-50 p-2 rounded text-xs mt-3">
                  <p className="font-medium text-red-800">🎯 Maior Ponto de Perda:</p>
                  <p className="text-gray-700">{analise.funil?.ponto_maior_perda}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Distribuição por Estágio</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analise.distribuicao_funil || []}
                    dataKey="quantidade"
                    nameKey="tipo"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {(analise.distribuicao_funil || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Artigos Sugeridos com ROI */}
          {analise.artigos_sugeridos_roi?.length > 0 && (
            <div>
              <h3 className="font-bold mb-4">Artigos Estratégicos (ROI Estimado)</h3>
              <div className="grid gap-4">
                {analise.artigos_sugeridos_roi.map((artigo, idx) => (
                  <div key={idx} className="border-2 border-green-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-600 text-white">{artigo.tipo_funil}</Badge>
                          <Badge className={artigo.prioridade_negocio === 'Alta' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'}>
                            {artigo.prioridade_negocio}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{artigo.titulo}</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {artigo.keywords?.map((kw, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{kw}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-white p-3 rounded border">
                        <Users className="w-4 h-4 text-blue-600 mb-1" />
                        <p className="text-xs text-gray-600">Visitantes/mês</p>
                        <p className="text-lg font-bold text-blue-600">{artigo.roi_visitantes_mes}</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <TrendingDown className="w-4 h-4 text-orange-600 mb-1" />
                        <p className="text-xs text-gray-600">Leads/mês</p>
                        <p className="text-lg font-bold text-orange-600">{artigo.roi_leads_mes}</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <DollarSign className="w-4 h-4 text-green-600 mb-1" />
                        <p className="text-xs text-gray-600">Receita pot.</p>
                        <p className="text-lg font-bold text-green-600">
                          R$ {artigo.roi_receita_potencial?.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span>⏱️ Tempo criação: {artigo.tempo_criacao_horas}h</span>
                      <span className="font-medium text-green-700">
                        ROI: {((artigo.roi_receita_potencial / (artigo.tempo_criacao_horas * 100)) * 100).toFixed(0)}%
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => criarArtigoROI(artigo)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Criar Artigo (ROI R$ {artigo.roi_receita_potencial})
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gaps Estratégicos */}
          {analise.gaps_estrategicos?.length > 0 && (
            <div>
              <h3 className="font-bold mb-4">Gaps Estratégicos Detectados</h3>
              <div className="space-y-2">
                {analise.gaps_estrategicos.map((gap, idx) => (
                  <div key={idx} className="border border-yellow-200 rounded p-3 bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{gap.keyword}</span>
                      <Badge className="bg-yellow-600 text-white">
                        {gap.volume} buscas/mês
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-700 mb-1">
                      <span className="font-medium">Faltando:</span> {gap.tipo_faltante}
                    </p>
                    <p className="text-xs text-gray-600 italic">{gap.impacto}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
});