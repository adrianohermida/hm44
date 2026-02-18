import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, TrendingDown, TrendingUp, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export default function AnaliseFunil({ escritorioId }) {
  const [analisando, setAnalisando] = useState(false);
  const [analise, setAnalise] = useState(null);

  const { data: artigos = [] } = useQuery({
    queryKey: ['blog-funil', escritorioId],
    queryFn: () => base44.entities.Blog.filter({ 
      escritorio_id: escritorioId,
      publicado: true 
    })
  });

  const analisarFunil = async () => {
    setAnalisando(true);
    try {
      const conteudoExistente = artigos.map(a => ({
        titulo: a.titulo,
        categoria: a.categoria,
        keywords: a.keywords
      }));

      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise o funil de conteúdo jurídico existente e sugira estratégia completa:

ARTIGOS EXISTENTES:
${JSON.stringify(conteudoExistente, null, 2)}

Retorne análise estratégica de funil completo (ToFu, MoFu, BoFu):

1. TOPO DE FUNIL (Awareness):
   - Keywords de alto volume, baixa intenção
   - Artigos educacionais amplos
   - Exemplo: "o que é superendividamento"

2. MEIO DE FUNIL (Consideration):
   - Keywords de volume médio, intenção qualificada
   - Comparações, guias práticos
   - Exemplo: "como renegociar dívidas bancárias"

3. FUNDO DE FUNIL (Decision):
   - Keywords de baixo volume, alta intenção
   - Serviços específicos, urgência
   - Exemplo: "advogado renegociação dívidas são paulo"

4. GAPS CRÍTICOS:
   - Keywords ausentes por estágio
   - Temas sem cobertura
   - Oportunidades de linkagem interna

5. PLANO DE AÇÃO:
   - 5 artigos prioritários (com títulos sugeridos)
   - Sequência de publicação otimizada
   - Estratégia de interligação`,
        response_json_schema: {
          type: "object",
          properties: {
            topo: {
              type: "object",
              properties: {
                keywords_faltando: { type: "array", items: { type: "string" } },
                artigos_sugeridos: { type: "array", items: { type: "string" } }
              }
            },
            meio: {
              type: "object",
              properties: {
                keywords_faltando: { type: "array", items: { type: "string" } },
                artigos_sugeridos: { type: "array", items: { type: "string" } }
              }
            },
            fundo: {
              type: "object",
              properties: {
                keywords_faltando: { type: "array", items: { type: "string" } },
                artigos_sugeridos: { type: "array", items: { type: "string" } }
              }
            },
            gaps_criticos: { type: "array", items: { type: "string" } },
            plano_acao: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalise(resultado);
      toast.success('Análise de funil completa!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro na análise');
    } finally {
      setAnalisando(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">Análise de Funil de Conteúdo</h3>
          <p className="text-sm text-gray-600">
            Estratégia completa: topo, meio e fundo de funil
          </p>
        </div>
        <Button onClick={analisarFunil} disabled={analisando}>
          <Sparkles className={`w-4 h-4 mr-2 ${analisando ? 'animate-pulse' : ''}`} />
          {analisando ? 'Analisando...' : 'Analisar Funil'}
        </Button>
      </div>

      {analise && (
        <div className="space-y-4 mt-6">
          <FunilEstagioCard
            icon={TrendingUp}
            titulo="Topo de Funil (ToFu)"
            cor="blue"
            keywords={analise.topo?.keywords_faltando || []}
            artigos={analise.topo?.artigos_sugeridos || []}
          />
          
          <FunilEstagioCard
            icon={Target}
            titulo="Meio de Funil (MoFu)"
            cor="yellow"
            keywords={analise.meio?.keywords_faltando || []}
            artigos={analise.meio?.artigos_sugeridos || []}
          />
          
          <FunilEstagioCard
            icon={TrendingDown}
            titulo="Fundo de Funil (BoFu)"
            cor="green"
            keywords={analise.fundo?.keywords_faltando || []}
            artigos={analise.fundo?.artigos_sugeridos || []}
          />

          {analise.gaps_criticos?.length > 0 && (
            <Card className="p-4 bg-red-50 border-red-200">
              <h4 className="font-bold text-red-900 mb-2">⚠️ Gaps Críticos</h4>
              <ul className="space-y-1 text-sm">
                {analise.gaps_criticos.map((gap, i) => (
                  <li key={i} className="text-red-700">• {gap}</li>
                ))}
              </ul>
            </Card>
          )}

          {analise.plano_acao?.length > 0 && (
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">🎯 Plano de Ação</h4>
              <ol className="space-y-1 text-sm">
                {analise.plano_acao.map((acao, i) => (
                  <li key={i} className="text-purple-700">{i + 1}. {acao}</li>
                ))}
              </ol>
            </Card>
          )}
        </div>
      )}
    </Card>
  );
}

function FunilEstagioCard({ icon: Icon, titulo, cor, keywords, artigos }) {
  const cores = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    green: 'bg-green-50 border-green-200 text-green-900'
  };

  return (
    <Card className={`p-4 ${cores[cor]}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" />
        <h4 className="font-bold">{titulo}</h4>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium mb-1">Keywords Faltando:</p>
          <div className="flex flex-wrap gap-1">
            {keywords.map((kw, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-white rounded">
                {kw}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-xs font-medium mb-1">Artigos Sugeridos:</p>
          <ul className="space-y-1 text-sm">
            {artigos.map((art, i) => (
              <li key={i}>• {art}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}