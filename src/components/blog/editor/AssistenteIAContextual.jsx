import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, Link2, Volume2, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AssistenteIAContextual({ 
  topicoAtual, 
  titulo, 
  categoria, 
  keywords,
  onAplicarSugestao,
  escritorioId 
}) {
  const [sugestoes, setSugestoes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (topicoAtual?.texto && topicoAtual.texto.length > 10) {
      gerarSugestoesContextuais();
    }
  }, [topicoAtual?.id]);

  const gerarSugestoesContextuais = async () => {
    if (!topicoAtual || carregando) return;
    
    setCarregando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `ASSISTENTE CONTEXTUAL - Sugestões em Tempo Real

CONTEXTO DO ARTIGO:
Título: "${titulo}"
Categoria: ${categoria}
Keywords: ${keywords?.join(', ')}

TÓPICO ATUAL:
Tipo: ${topicoAtual.tipo}
Texto: "${topicoAtual.texto}"

GERE 3-5 SUGESTÕES APLICÁVEIS:

1. REFINAR: Melhorar clareza, precisão, persuasão
2. EXPANDIR: Adicionar exemplos, dados, detalhes
3. LINKS INTERNOS: Sugerir artigos relacionados (use keywords)
4. TOM: Ajustar formalidade/acessibilidade
5. RESUMO: Gerar versão concisa

Para cada sugestão:
- Tipo (refinar/expandir/link/tom/resumo)
- Texto otimizado aplicável
- Justificativa breve
- Prioridade (alta/média/baixa)`,
        response_json_schema: {
          type: "object",
          properties: {
            sugestoes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipo: { type: "string" },
                  texto_otimizado: { type: "string" },
                  justificativa: { type: "string" },
                  prioridade: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSugestoes(resultado.sugestoes || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setCarregando(false);
    }
  };

  const aplicarSugestao = (sugestao) => {
    onAplicarSugestao({
      ...topicoAtual,
      texto: sugestao.texto_otimizado
    });
    toast.success('Sugestão aplicada!');
  };

  const getTipoIcon = (tipo) => {
    if (tipo === 'refinar') return <Wand2 className="w-3 h-3" />;
    if (tipo === 'expandir') return <FileText className="w-3 h-3" />;
    if (tipo === 'link') return <Link2 className="w-3 h-3" />;
    if (tipo === 'tom') return <Volume2 className="w-3 h-3" />;
    return <Sparkles className="w-3 h-3" />;
  };

  const getPrioridadeColor = (prioridade) => {
    if (prioridade === 'alta') return 'bg-red-600';
    if (prioridade === 'média') return 'bg-yellow-600';
    return 'bg-green-600';
  };

  if (!topicoAtual) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <h4 className="font-bold text-sm text-purple-900">Assistente IA</h4>
        {carregando && <Badge variant="outline" className="text-xs">Analisando...</Badge>}
      </div>

      {sugestoes.length === 0 && !carregando && (
        <p className="text-xs text-gray-500 italic">
          Edite um tópico para ver sugestões contextuais
        </p>
      )}

      <div className="space-y-2">
        {sugestoes.map((sugestao, idx) => (
          <div key={idx} className="bg-white p-3 rounded border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTipoIcon(sugestao.tipo)}
                <span className="text-xs font-medium capitalize">{sugestao.tipo}</span>
                <Badge className={`${getPrioridadeColor(sugestao.prioridade)} text-white text-xs`}>
                  {sugestao.prioridade}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic mb-2">{sugestao.justificativa}</p>
            <div className="bg-blue-50 p-2 rounded text-xs mb-2 max-h-32 overflow-y-auto">
              {sugestao.texto_otimizado}
            </div>
            <Button
              size="sm"
              onClick={() => aplicarSugestao(sugestao)}
              className="w-full"
              variant="outline"
            >
              Aplicar
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}