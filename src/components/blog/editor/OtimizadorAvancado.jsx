import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function OtimizadorAvancado({ artigo, onAplicar }) {
  const [otimizando, setOtimizando] = useState(false);
  const [sugestoes, setSugestoes] = useState(null);

  const analisar = async () => {
    setOtimizando(true);
    try {
      const conteudo = artigo.topicos.map(t => t.texto || t.itens?.join(' ') || '').join('\n');
      
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise este artigo jurídico e forneça sugestões específicas de otimização:

TÍTULO: ${artigo.titulo}
META: ${artigo.meta_description || 'não definida'}
CONTEÚDO: ${conteudo.substring(0, 2000)}

Retorne sugestões práticas para alcançar 100/100 no SEO:
- Melhorias no título
- Otimizações na meta description
- Palavras-chave adicionais
- Estrutura de conteúdo
- CTAs e engajamento

Seja específico e prático.`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo_sugestao: { type: "string" },
            meta_sugestao: { type: "string" },
            keywords_sugeridas: { type: "array", items: { type: "string" } },
            melhorias: { type: "array", items: { type: "string" } }
          }
        }
      });

      setSugestoes(resultado);
      toast.success('Análise completa!');
    } catch (error) {
      console.error('Erro ao otimizar:', error);
      toast.error('Erro na otimização');
    } finally {
      setOtimizando(false);
    }
  };

  const aplicarSugestoes = () => {
    if (!sugestoes) return;
    
    onAplicar({
      titulo: sugestoes.titulo_sugestao || artigo.titulo,
      meta_description: sugestoes.meta_sugestao || artigo.meta_description,
      keywords: [...new Set([...(artigo.keywords || []), ...(sugestoes.keywords_sugeridas || [])])]
    });
    
    setSugestoes(null);
    toast.success('Sugestões aplicadas!');
  };

  return (
    <Card className="p-4">
      <h3 className="font-bold mb-3">Otimizador Avançado</h3>
      
      <Button
        onClick={analisar}
        disabled={otimizando}
        className="w-full mb-4"
      >
        {otimizando ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analisando...</>
        ) : (
          <><Sparkles className="w-4 h-4 mr-2" />Analisar & Otimizar</>
        )}
      </Button>

      {sugestoes && (
        <div className="space-y-3">
          {sugestoes.titulo_sugestao && (
            <div className="p-3 bg-blue-50 rounded">
              <p className="text-xs font-medium text-blue-900 mb-1">Título sugerido:</p>
              <p className="text-sm">{sugestoes.titulo_sugestao}</p>
            </div>
          )}
          
          {sugestoes.meta_sugestao && (
            <div className="p-3 bg-green-50 rounded">
              <p className="text-xs font-medium text-green-900 mb-1">Meta description sugerida:</p>
              <p className="text-sm">{sugestoes.meta_sugestao}</p>
            </div>
          )}
          
          {sugestoes.melhorias?.length > 0 && (
            <div className="p-3 bg-purple-50 rounded">
              <p className="text-xs font-medium text-purple-900 mb-2">Melhorias recomendadas:</p>
              <ul className="text-sm space-y-1">
                {sugestoes.melhorias.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={aplicarSugestoes} className="w-full" variant="outline">
            Aplicar Todas Sugestões
          </Button>
        </div>
      )}
    </Card>
  );
}