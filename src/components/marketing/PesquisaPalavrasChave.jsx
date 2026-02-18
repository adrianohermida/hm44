import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function PesquisaPalavrasChave() {
  const [termo, setTermo] = useState("");
  const [resultado, setResultado] = useState(null);

  const pesquisarMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `PESQUISA KEYWORDS - Google Keyword Planner Style

TERMO BASE: "${termo}"

SIMULE dados do Google Keyword Planner para Brasil:

1. PALAVRA-CHAVE PRINCIPAL
   - Volume de busca mensal médio
   - Dificuldade (Baixa/Média/Alta)
   - CPC sugerido (R$)
   - Tendência (crescendo/estável/decrescendo)

2. VARIAÇÕES RELACIONADAS (10 keywords)
   - Para cada: volume, dificuldade, CPC, intenção

3. LONG-TAIL (5 keywords específicas)
   - Baixa concorrência, alta intenção comercial

4. LSI KEYWORDS (8 termos semanticamente relacionados)

5. PERGUNTAS FREQUENTES (5 "People Also Ask")

CONTEXTO PROFUNDO:
- Nicho: Direito do Consumidor + Superendividamento + Bancos
- Geografia: Brasil (considerar regionalismo: Sul/Sudeste)
- Demografia: 25-55 anos, classe C/D, endividados, busca solução urgente
- Psicografia: Ansiedade financeira, medo jurídico, busca autoridade
- Estágio Jornada: Awareness (60%) | Consideration (30%) | Decision (10%)

PREFERÊNCIAS KEYWORDS:
- Long-tail específicas (3-5 palavras)
- Intenção transacional ("como fazer", "passo a passo", "modelo", "advogado")
- Evitar keywords informacionais genéricas ("o que é")
- Priorizar keywords com "2024", "atualizado", "novo"`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            principal: {
              type: "object",
              properties: {
                keyword: { type: "string" },
                volume: { type: "number" },
                dificuldade: { type: "string" },
                cpc: { type: "number" },
                tendencia: { type: "string" }
              }
            },
            variacoes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  volume: { type: "number" },
                  dificuldade: { type: "string" },
                  cpc: { type: "number" },
                  intencao: { type: "string" }
                }
              }
            },
            long_tail: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  volume: { type: "number" }
                }
              }
            },
            lsi_keywords: { type: "array", items: { type: "string" } },
            perguntas: { type: "array", items: { type: "string" } }
          }
        }
      });
      return response;
    },
    onSuccess: (data) => {
      setResultado(data);
      toast.success("Pesquisa concluída!");
    }
  });

  const getTendenciaIcon = (tendencia) => {
    if (tendencia?.includes('cresc')) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (tendencia?.includes('decr')) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getDificuldadeColor = (dif) => {
    if (dif === 'Baixa') return 'bg-green-100 text-green-800';
    if (dif === 'Média') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg">Pesquisa de Palavras-Chave</h3>
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Ex: renegociação de dívidas"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && pesquisarMutation.mutate()}
        />
        <Button
          onClick={() => pesquisarMutation.mutate()}
          disabled={!termo || pesquisarMutation.isPending}
        >
          {pesquisarMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {resultado && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg">{resultado.principal.keyword}</h4>
              {getTendenciaIcon(resultado.principal.tendencia)}
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Volume/mês</p>
                <p className="font-bold text-xl">{resultado.principal.volume.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">CPC</p>
                <p className="font-bold text-xl">R$ {resultado.principal.cpc.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Dificuldade</p>
                <Badge className={getDificuldadeColor(resultado.principal.dificuldade)}>
                  {resultado.principal.dificuldade}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Variações Relacionadas</h4>
            <div className="space-y-2">
              {resultado.variacoes.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{v.keyword}</p>
                    <p className="text-xs text-gray-600">{v.intencao}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{v.volume.toLocaleString()}/mês</span>
                    <Badge className={getDificuldadeColor(v.dificuldade)} variant="outline">
                      {v.dificuldade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Long-Tail (Baixa Concorrência)</h4>
            <div className="flex flex-wrap gap-2">
              {resultado.long_tail.map((lt, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {lt.keyword} ({lt.volume}/mês)
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">LSI Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {resultado.lsi_keywords.map((lsi, i) => (
                <Badge key={i} className="bg-purple-100 text-purple-800">
                  {lsi}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Perguntas Frequentes</h4>
            <ul className="space-y-2">
              {resultado.perguntas.map((p, i) => (
                <li key={i} className="text-sm text-gray-700">❓ {p}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}