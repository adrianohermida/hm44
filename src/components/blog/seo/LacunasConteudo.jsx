import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import LacunasHeader from "./lacunas/LacunasHeader";
import LacunasLoading from "./lacunas/LacunasLoading";
import LacunasEmpty from "./lacunas/LacunasEmpty";
import LacunasList from "./lacunas/LacunasList";

export default function LacunasConteudo({ categoria, keywords = [] }) {
  const [analisando, setAnalisando] = useState(false);
  const [lacunas, setLacunas] = useState(null);
  const [erro, setErro] = useState(null);

  const analisarLacunas = async () => {
    if (!categoria) {
      toast.error('Categoria necessária');
      return;
    }

    setAnalisando(true);
    setErro(null);

    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise lacunas de conteúdo para categoria "${categoria}" no nicho jurídico brasileiro.
        Keywords contexto: ${keywords.join(', ')}.
        
        Identifique:
        - topicos_faltando: array de tópicos ainda não cobertos (5-7 itens)
        - perguntas_frequentes: perguntas comuns não respondidas (5-7 itens)
        - oportunidades: oportunidades de conteúdo por dificuldade (5 itens)
        
        Cada oportunidade deve ter: titulo, dificuldade_ranqueamento (0-100), volume_busca_estimado, tipo_conteudo (guia/tutorial/checklist/comparativo).
        
        Foque em lacunas reais do mercado jurídico brasileiro.`,
        response_json_schema: {
          type: "object",
          properties: {
            topicos_faltando: { type: "array", items: { type: "string" } },
            perguntas_frequentes: { type: "array", items: { type: "string" } },
            oportunidades: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  dificuldade_ranqueamento: { type: "number" },
                  volume_busca_estimado: { type: "number" },
                  tipo_conteudo: { type: "string" }
                }
              }
            }
          }
        }
      });

      setLacunas(resultado);
      toast.success('Análise de lacunas concluída');
    } catch (error) {
      console.error('Erro ao analisar lacunas:', error);
      setErro(error.message || 'Erro ao analisar lacunas');
      toast.error('Erro ao analisar lacunas');
    } finally {
      setAnalisando(false);
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
      <LacunasHeader analisando={analisando} disabled={!categoria} onClick={analisarLacunas} />
      {analisando && <LacunasLoading />}
      {erro && !analisando && (
        <div className="text-center py-4 text-red-600" role="alert">
          <p className="text-xs sm:text-sm">{erro}</p>
        </div>
      )}
      {!analisando && !lacunas && !erro && <LacunasEmpty />}
      {lacunas && !analisando && <LacunasList lacunas={lacunas} />}
    </Card>
  );
}