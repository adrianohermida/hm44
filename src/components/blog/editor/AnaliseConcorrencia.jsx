import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Loader2, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import ConcorrenteCard from "./concorrencia/ConcorrenteCard";
import InsightsPanel from "./concorrencia/InsightsPanel";
import KeywordsList from "./concorrencia/KeywordsList";
import ConcorrenteSelector from "./concorrencia/ConcorrenteSelector";
import ComparativoVisual from "./concorrencia/ComparativoVisual";

export default function AnaliseConcorrencia({ titulo, keywords = [], onAnaliseCompleta }) {
  const [analisando, setAnalisando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [concorrentesSelecionados, setConcorrentesSelecionados] = useState([]);

  const analisarConcorrencia = async () => {
    if (!titulo || titulo.length < 10) {
      toast.error('Digite um título mais completo para análise');
      return;
    }

    setAnalisando(true);
    try {
      const queryBusca = keywords.length > 0 
        ? `${titulo} ${keywords.slice(0, 3).join(' ')}`
        : titulo;

      const resultadoBusca = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um analista de SEO especializado em conteúdo jurídico.

TAREFA: Analise os 5 primeiros resultados do Google para a busca: "${queryBusca}"

Simule uma busca no Google e retorne dados estruturados dos TOP 5 concorrentes com métricas avançadas.

RETORNE JSON:
{
  "concorrentes": [
    {
      "ranking": 1,
      "titulo": "título do artigo",
      "url": "url do artigo",
      "dominio": "exemplo.com",
      "palavra_count": 1500,
      "h2_count": 5,
      "h3_count": 8,
      "keywords_principais": ["palavra1", "palavra2"],
      "pontos_fortes": "estrutura clara, use de exemplos práticos",
      "score_seo": 85,
      "trafego_organico_estimado": 2500,
      "backlinks_estimados": 45,
      "domain_authority": 68
    }
  ],
  "insights": {
    "recomendacoes": [
      "Adicione mais exemplos práticos como o concorrente #1",
      "Melhore a estrutura H2/H3 para competir com #2"
    ],
    "gap_oportunidade": "Nenhum concorrente cobre casos de superendividamento empresarial - oportunidade única",
    "palavras_alvo": ["palavra1", "palavra2"],
    "tamanho_ideal": 2000
  }
}

CRITÉRIOS DE ANÁLISE:
1. Score SEO (0-100):
   - Estrutura de headings (H1, H2, H3)
   - Contagem de palavras
   - Uso de keywords
   - Qualidade do conteúdo

2. Pontos Fortes:
   - O que o concorrente faz bem
   - Elementos que destacam o artigo

3. Insights Estratégicos:
   - O que você precisa fazer para competir
   - Oportunidades não exploradas
   - Gaps de conteúdo

Seja específico e acionável nas recomendações.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            concorrentes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ranking: { type: "number" },
                  titulo: { type: "string" },
                  url: { type: "string" },
                  palavra_count: { type: "number" },
                  h2_count: { type: "number" },
                  h3_count: { type: "number" },
                  keywords_principais: { type: "array", items: { type: "string" } },
                  pontos_fortes: { type: "string" },
                  score_seo: { type: "number" },
                  dominio: { type: "string" },
                  trafego_organico_estimado: { type: "number" },
                  backlinks_estimados: { type: "number" },
                  domain_authority: { type: "number" }
                }
              }
            },
            insights: {
              type: "object",
              properties: {
                recomendacoes: { type: "array", items: { type: "string" } },
                gap_oportunidade: { type: "string" },
                palavras_alvo: { type: "array", items: { type: "string" } },
                tamanho_ideal: { type: "number" }
              }
            }
          }
        }
      });

      setResultado(resultadoBusca);
      if (resultadoBusca?.concorrentes?.length > 0) {
        setConcorrentesSelecionados(resultadoBusca.concorrentes.slice(0, 3).map(c => c.ranking));
      }
      if (onAnaliseCompleta) {
        onAnaliseCompleta(resultadoBusca);
      }
      toast.success('Análise de concorrência concluída');
    } catch (error) {
      console.error('Erro na análise:', error);
      toast.error('Erro ao analisar concorrência');
    } finally {
      setAnalisando(false);
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Análise de Concorrência
          </h4>
          <p className="text-xs text-gray-600 mt-0.5">
            Compare com Top 3 do Google
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={analisarConcorrencia}
          disabled={analisando || !titulo}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {analisando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Analisar
            </>
          )}
        </Button>
      </div>

      {analisando && (
        <div className="bg-white p-4 rounded-lg text-center text-sm text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          Buscando e analisando top 3 resultados do Google...
        </div>
      )}

      {resultado && !analisando && (
        <div className="space-y-3">
          <ConcorrenteSelector 
            concorrentes={resultado.concorrentes}
            selecionados={concorrentesSelecionados}
            onChange={setConcorrentesSelecionados}
          />

          <div className="space-y-2">
            {resultado.concorrentes
              ?.filter(c => concorrentesSelecionados.includes(c.ranking))
              .map((conc) => (
                <div key={conc.ranking}>
                  <ConcorrenteCard concorrente={conc} ranking={conc.ranking} />
                  <KeywordsList keywords={conc.keywords_principais} />
                </div>
              ))}
          </div>

          {concorrentesSelecionados.length > 0 && (
            <ComparativoVisual 
              concorrentes={resultado.concorrentes.filter(c => 
                concorrentesSelecionados.includes(c.ranking)
              )}
            />
          )}

          <InsightsPanel insights={resultado.insights} />

          {resultado.insights?.tamanho_ideal && (
            <div className="bg-white p-3 rounded-lg border text-center">
              <p className="text-xs text-gray-600 mb-1">📏 Tamanho Ideal Recomendado</p>
              <p className="text-2xl font-bold text-blue-600">
                {resultado.insights.tamanho_ideal} palavras
              </p>
            </div>
          )}
        </div>
      )}

      {!resultado && !analisando && (
        <p className="text-xs text-center text-gray-500 py-2">
          Clique em "Analisar" para comparar com concorrentes
        </p>
      )}
    </Card>
  );
}