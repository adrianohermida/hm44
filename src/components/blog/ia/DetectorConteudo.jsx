import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import DetectorHeader from "./detector/DetectorHeader";
import DetectorLoading from "./detector/DetectorLoading";
import DetectorEmpty from "./detector/DetectorEmpty";
import DetectorResultado from "./detector/DetectorResultado";

export default function DetectorConteudo({ topicos = [], titulo = "" }) {
  const [analisando, setAnalisando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const analisarConteudo = async () => {
    const conteudoCompleto = topicos
      .map(t => t.tipo === 'lista' ? t.itens?.join(' ') : t.texto)
      .filter(Boolean)
      .join(' ');

    if (!conteudoCompleto || conteudoCompleto.length < 100) {
      toast.error('Conteúdo muito curto para análise');
      return;
    }

    setAnalisando(true);
    setErro(null);

    try {
      const analise = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise o conteúdo jurídico abaixo e detecte problemas de qualidade:

TÍTULO: ${titulo}
CONTEÚDO: ${conteudoCompleto}

Identifique:
1. Conteúdo duplicado (frases/parágrafos repetidos)
2. Conteúdo fraco (vago, genérico, sem valor)
3. Contradições ou inconsistências
4. Informações desatualizadas
5. Falta de profundidade técnica

Retorne análise estruturada com score geral e problemas específicos.`,
        response_json_schema: {
          type: "object",
          properties: {
            score_qualidade: { type: "number" },
            problemas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipo: { type: "string" },
                  severidade: { type: "string" },
                  localizacao: { type: "string" },
                  descricao: { type: "string" },
                  sugestao: { type: "string" }
                }
              }
            },
            metricas: {
              type: "object",
              properties: {
                duplicacao_percentual: { type: "number" },
                densidade_informacao: { type: "number" },
                profundidade_tecnica: { type: "number" }
              }
            }
          }
        }
      });

      setResultado(analise);
      toast.success('Análise concluída');
    } catch (error) {
      console.error('Erro ao analisar:', error);
      setErro(error.message || 'Erro ao analisar conteúdo');
      toast.error('Erro ao analisar conteúdo');
    } finally {
      setAnalisando(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 border-2">
      <DetectorHeader
        analisando={analisando}
        disabled={topicos.length === 0}
        onClick={analisarConteudo}
      />

      {analisando && <DetectorLoading />}

      {erro && !analisando && (
        <div className="text-center py-4 text-red-600" role="alert">
          <p className="text-xs sm:text-sm">{erro}</p>
        </div>
      )}

      {!analisando && !resultado && !erro && <DetectorEmpty />}

      {resultado && !analisando && <DetectorResultado resultado={resultado} />}
    </Card>
  );
}