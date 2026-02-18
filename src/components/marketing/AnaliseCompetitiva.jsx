import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Loader2, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AnaliseCompetitiva() {
  const [keyword, setKeyword] = useState("");
  const [analise, setAnalise] = useState(null);

  const analisarMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `ANÁLISE COMPETITIVA SEO - Keyword: "${keyword}"

SIMULE análise dos TOP 3 artigos ranqueando no Google BR:

Para cada concorrente:
1. URL do artigo
2. Título H1
3. Word count (aprox)
4. H2/H3 usados (estrutura)
5. Keywords no conteúdo (principais 5)
6. Domain Authority (0-100)
7. Backlinks estimados
8. Publicado há quanto tempo
9. Pontos fortes (o que está bom)
10. Gaps encontrados (o que falta)

ANÁLISE CONSOLIDADA:
- O que todos fazem (padrão do mercado)
- O que ninguém faz (oportunidade)
- Angulo único sugerido
- Diferencial competitivo recomendado

ANÁLISE COMPETITIVA PROFUNDA:
- Identificar gaps SUTIS (não óbvios)
- Analisar tom/linguagem (formal vs acessível)
- Verificar CTAs usados (força, posição)
- Mapear objeções não respondidas
- Identificar público secundário ignorado
- Verificar uso de storytelling/casos reais
- Analisar densidade emocional (medo/esperança)
- Checkar proof elements (dados, leis, estatísticas)

CONTEXTO: Direito do Consumidor Brasil, foco superendividamento`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            concorrentes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  titulo: { type: "string" },
                  word_count: { type: "number" },
                  estrutura: { type: "array", items: { type: "string" } },
                  keywords: { type: "array", items: { type: "string" } },
                  domain_authority: { type: "number" },
                  backlinks: { type: "number" },
                  idade_dias: { type: "number" },
                  pontos_fortes: { type: "array", items: { type: "string" } },
                  gaps: { type: "array", items: { type: "string" } }
                }
              }
            },
            padrao_mercado: { type: "array", items: { type: "string" } },
            oportunidades: { type: "array", items: { type: "string" } },
            angulo_unico: { type: "string" },
            diferencial: { type: "string" }
          }
        }
      });
      return response;
    },
    onSuccess: (data) => {
      setAnalise(data);
      toast.success("Análise competitiva concluída!");
    }
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-orange-600" />
        <h3 className="font-bold text-lg">Análise Competitiva</h3>
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Palavra-chave para analisar"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && analisarMutation.mutate()}
        />
        <Button
          onClick={() => analisarMutation.mutate()}
          disabled={!keyword || analisarMutation.isPending}
        >
          {analisarMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Target className="w-4 h-4" />
          )}
        </Button>
      </div>

      {analise && (
        <div className="space-y-6">
          {analise.concorrentes.map((conc, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold mb-1">#{i + 1} - {conc.titulo}</h4>
                  <a href={conc.url} target="_blank" rel="noopener" className="text-xs text-blue-600 flex items-center gap-1">
                    {conc.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  DA: {conc.domain_authority}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-600">Palavras</p>
                  <p className="font-bold">{conc.word_count}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-600">Backlinks</p>
                  <p className="font-bold">{conc.backlinks}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-600">Idade</p>
                  <p className="font-bold">{conc.idade_dias}d</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold mb-1">Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {conc.keywords.map((kw, j) => (
                    <Badge key={j} variant="outline" className="text-xs">{kw}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-semibold mb-1 text-green-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Pontos Fortes
                  </p>
                  <ul className="space-y-1">
                    {conc.pontos_fortes.map((pf, j) => (
                      <li key={j} className="text-gray-700">• {pf}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-red-700 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Gaps/Falta
                  </p>
                  <ul className="space-y-1">
                    {conc.gaps.map((gap, j) => (
                      <li key={j} className="text-gray-700">• {gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h4 className="font-bold mb-3 text-green-800">Estratégia Recomendada</h4>
            
            <div className="mb-3">
              <p className="text-sm font-semibold mb-1">Padrão do Mercado:</p>
              <ul className="text-sm space-y-1">
                {analise.padrao_mercado.map((p, i) => (
                  <li key={i} className="text-gray-700">✓ {p}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <p className="text-sm font-semibold mb-1 text-orange-700">Oportunidades (ninguém faz):</p>
              <ul className="text-sm space-y-1">
                {analise.oportunidades.map((op, i) => (
                  <li key={i} className="text-gray-700">🎯 {op}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-white rounded border border-blue-200">
              <p className="text-sm font-semibold text-blue-800 mb-1">Ângulo Único Sugerido:</p>
              <p className="text-sm">{analise.angulo_unico}</p>
            </div>

            <div className="mt-3 p-3 bg-white rounded border border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-1">Diferencial Competitivo:</p>
              <p className="text-sm">{analise.diferencial}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}