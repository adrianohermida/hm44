import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import AutoridadeHeader from "./autoridade/AutoridadeHeader";
import AutoridadeLoading from "./autoridade/AutoridadeLoading";
import AutoridadeEmpty from "./autoridade/AutoridadeEmpty";
import AutoridadeMetricas from "./autoridade/AutoridadeMetricas";
import AutoridadeProjecao from "./autoridade/AutoridadeProjecao";

export default function MetricasAutoridade({ titulo, keywords = [] }) {
  const [analisando, setAnalisando] = useState(false);
  const [metricas, setMetricas] = useState(null);

  const analisarAutoridade = async () => {
    if (!titulo) {
      toast.error('Título obrigatório para análise');
      return;
    }

    setAnalisando(true);

    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise métricas de autoridade SEO para: "${titulo}". Keywords: ${keywords.join(', ')}. 
        Retorne dificuldade_ranqueamento (0-100), projecao_trafego_mensal, volume_busca_estimado, 
        potencial_conversao (baixo/medio/alto), tempo_ranqueamento (meses), autoridade_necessaria (0-100), 
        e recomendacoes (array de 3-4 strings). Considere nicho jurídico brasileiro.`,
        response_json_schema: {
          type: "object",
          properties: {
            dificuldade_ranqueamento: { type: "number" },
            projecao_trafego_mensal: { type: "number" },
            volume_busca_estimado: { type: "number" },
            potencial_conversao: { type: "string" },
            tempo_ranqueamento: { type: "number" },
            autoridade_necessaria: { type: "number" },
            recomendacoes: { type: "array", items: { type: "string" } }
          }
        }
      });

      setMetricas(resultado);
      toast.success('Análise de autoridade concluída');
    } catch (error) {
      toast.error('Erro ao analisar autoridade');
    } finally {
      setAnalisando(false);
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <AutoridadeHeader analisando={analisando} disabled={!titulo} onClick={analisarAutoridade} />
      {analisando && <AutoridadeLoading />}
      {!analisando && !metricas && <AutoridadeEmpty />}
      {metricas && !analisando && (
        <div className="space-y-3">
          <AutoridadeMetricas metricas={metricas} />
          <AutoridadeProjecao metricas={metricas} />
        </div>
      )}
    </Card>
  );
}