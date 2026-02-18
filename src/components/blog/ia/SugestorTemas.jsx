import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import SugestorHeader from "./sugestor/SugestorHeader";
import SugestorLoading from "./sugestor/SugestorLoading";
import SugestorEmpty from "./sugestor/SugestorEmpty";
import TemasList from "./sugestor/TemasList";

export default function SugestorTemas({ categoria, onTemaSelecionado }) {
  const [carregando, setCarregando] = useState(false);
  const [temas, setTemas] = useState(null);
  const [erro, setErro] = useState(null);

  const gerarSugestoes = async () => {
    if (!categoria) {
      toast.error('Selecione uma categoria');
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise tendências e volume de busca para a categoria "${categoria}" no nicho jurídico brasileiro.
        
        Gere 8-10 sugestões de temas com alto potencial de tráfego e baixa concorrência.
        
        Para cada tema, retorne:
        - titulo: título completo otimizado para SEO
        - volume_busca_mensal: estimativa de buscas/mês (número realista)
        - dificuldade_ranqueamento: 0-100 (quão difícil é ranquear)
        - tendencia: "crescente" | "estavel" | "declinante"
        - intencao_busca: "informacional" | "transacional" | "navegacional"
        - keywords_relacionadas: array de 3-5 keywords LSI
        - potencial_conversao: "alto" | "medio" | "baixo"
        - motivo: breve explicação do potencial (1 frase)
        
        Foque em temas específicos do direito do consumidor, superendividamento e negociação de dívidas brasileiras.`,
        response_json_schema: {
          type: "object",
          properties: {
            temas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  volume_busca_mensal: { type: "number" },
                  dificuldade_ranqueamento: { type: "number" },
                  tendencia: { type: "string" },
                  intencao_busca: { type: "string" },
                  keywords_relacionadas: { type: "array", items: { type: "string" } },
                  potencial_conversao: { type: "string" },
                  motivo: { type: "string" }
                }
              }
            }
          }
        }
      });

      setTemas(resultado.temas || []);
      toast.success(`${resultado.temas?.length || 0} temas sugeridos`);
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      setErro(error.message || 'Erro ao gerar sugestões');
      toast.error('Erro ao gerar sugestões');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 border-2">
      <SugestorHeader 
        carregando={carregando} 
        disabled={!categoria} 
        onClick={gerarSugestoes}
        categoria={categoria}
      />
      {carregando && <SugestorLoading />}
      {erro && !carregando && (
        <div className="text-center py-4 text-red-600" role="alert">
          <p className="text-xs sm:text-sm">{erro}</p>
        </div>
      )}
      {!carregando && !temas && !erro && <SugestorEmpty />}
      {temas && temas.length > 0 && !carregando && (
        <TemasList temas={temas} onTemaSelecionado={onTemaSelecionado} />
      )}
    </Card>
  );
}