import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function IntencaoBuscaAnalyzer({ keywords = [], onSugestoesGeradas }) {
  const [analisando, setAnalisando] = useState(false);
  const [resultados, setResultados] = useState(null);

  const analisarIntencao = async () => {
    if (keywords.length === 0) {
      toast.error('Adicione pelo menos uma palavra-chave');
      return;
    }

    setAnalisando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise a intenção de busca das seguintes keywords no contexto jurídico brasileiro:
${keywords.join(', ')}

Para cada keyword, determine:
1. INTENÇÃO PRINCIPAL (informacional, navegacional, transacional, comercial)
2. ESTÁGIO DO FUNIL (topo/consciência, meio/consideração, fundo/decisão)
3. TIPO DE CONTEÚDO ideal (guia, checklist, comparativo, case, FAQ)
4. SUGESTÕES DE TÍTULOS otimizados (3 opções variadas)
5. ESTRUTURA recomendada de H2s
6. PONTOS-CHAVE que o leitor busca

Retorne análise completa em JSON estruturado.`,
        response_json_schema: {
          type: "object",
          properties: {
            keywords_analisadas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  intencao: { type: "string" },
                  funil: { type: "string" },
                  tipo_conteudo: { type: "string" },
                  titulos_sugeridos: {
                    type: "array",
                    items: { type: "string" }
                  },
                  estrutura_h2: {
                    type: "array",
                    items: { type: "string" }
                  },
                  pontos_chave: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      setResultados(resultado.keywords_analisadas || []);
      toast.success('Análise concluída!');
      if (onSugestoesGeradas) onSugestoesGeradas(resultado.keywords_analisadas);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao analisar intenção de busca');
    } finally {
      setAnalisando(false);
    }
  };

  const getIntencaoColor = (intencao) => {
    const lower = intencao?.toLowerCase() || '';
    if (lower.includes('informacional')) return 'bg-blue-100 text-blue-800';
    if (lower.includes('transacional')) return 'bg-green-100 text-green-800';
    if (lower.includes('comercial')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getFunilColor = (funil) => {
    const lower = funil?.toLowerCase() || '';
    if (lower.includes('topo')) return 'bg-yellow-100 text-yellow-800';
    if (lower.includes('meio')) return 'bg-orange-100 text-orange-800';
    if (lower.includes('fundo')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Análise de Intenção de Busca</span>
        </div>
        <Button 
          size="sm" 
          onClick={analisarIntencao} 
          disabled={analisando || keywords.length === 0}
        >
          <Sparkles className={`w-3 h-3 mr-1 ${analisando ? 'animate-pulse' : ''}`} />
          {analisando ? 'Analisando...' : 'Analisar com IA'}
        </Button>
      </div>

      {keywords.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Adicione palavras-chave para analisar a intenção de busca
        </p>
      )}

      {resultados && resultados.length > 0 && (
        <div className="space-y-4 mt-4">
          {resultados.map((resultado, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[var(--brand-primary)]" />
                    <span className="font-bold text-sm">{resultado.keyword}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getIntencaoColor(resultado.intencao)}>
                      {resultado.intencao}
                    </Badge>
                    <Badge className={getFunilColor(resultado.funil)}>
                      {resultado.funil}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {resultado.tipo_conteudo}
                    </Badge>
                  </div>
                </div>
              </div>

              {resultado.titulos_sugeridos && resultado.titulos_sugeridos.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-700">Títulos Sugeridos:</span>
                  <div className="mt-1 space-y-1">
                    {resultado.titulos_sugeridos.map((titulo, i) => (
                      <div key={i} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-[var(--brand-primary)] font-bold">{i + 1}.</span>
                        <span>{titulo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resultado.estrutura_h2 && resultado.estrutura_h2.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-700">Estrutura Recomendada:</span>
                  <div className="mt-1 space-y-1">
                    {resultado.estrutura_h2.map((h2, i) => (
                      <div key={i} className="text-xs text-gray-600 pl-2 border-l-2 border-gray-300">
                        {h2}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resultado.pontos_chave && resultado.pontos_chave.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-700">Pontos-Chave a Cobrir:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {resultado.pontos_chave.map((ponto, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {ponto}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}