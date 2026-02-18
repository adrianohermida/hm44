import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import ReescritaHeader from "./reescrita/ReescritaHeader";
import ReescritaLoading from "./reescrita/ReescritaLoading";
import ReescritaEmpty from "./reescrita/ReescritaEmpty";
import ReescritaResultado from "./reescrita/ReescritaResultado";

export default function ReescritaIA({ textoOriginal, objetivo = "legibilidade", onTextoReescrito }) {
  const [reescrevendo, setReescrevendo] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [objetivoAtual, setObjetivoAtual] = useState(objetivo);
  const [erro, setErro] = useState(null);

  const reescreverTexto = async () => {
    if (!textoOriginal || textoOriginal.length < 50) {
      toast.error('Texto muito curto para reescrever');
      return;
    }

    setReescrevendo(true);
    setErro(null);

    try {
      const prompts = {
        legibilidade: `Reescreva o texto jurídico abaixo para melhorar a LEGIBILIDADE:
        
        - Use frases curtas e diretas
        - Evite jargão técnico desnecessário
        - Mantenha tom profissional mas acessível
        - Estruture em parágrafos claros
        - Preserve informações técnicas essenciais
        
        TEXTO ORIGINAL:
        ${textoOriginal}
        
        Retorne apenas o texto reescrito, sem explicações.`,
        
        conversao: `Reescreva o texto jurídico abaixo para aumentar a CONVERSÃO:
        
        - Use gatilhos mentais apropriados (escassez, autoridade, prova social)
        - Adicione CTAs sutis e naturais
        - Destaque benefícios para o leitor
        - Use storytelling quando apropriado
        - Mantenhe credibilidade e ética jurídica
        - Tom persuasivo mas respeitoso
        
        TEXTO ORIGINAL:
        ${textoOriginal}
        
        Retorne apenas o texto reescrito, sem explicações.`,
        
        seo: `Reescreva o texto jurídico abaixo para otimizar SEO:
        
        - Incorpore naturalmente palavras-chave relacionadas
        - Use sinônimos e termos LSI
        - Melhore densidade semântica
        - Adicione perguntas que usuários fazem
        - Mantenha naturalidade da leitura
        
        TEXTO ORIGINAL:
        ${textoOriginal}
        
        Retorne apenas o texto reescrito, sem explicações.`
      };

      const textoReescrito = await base44.integrations.Core.InvokeLLM({
        prompt: prompts[objetivoAtual] || prompts.legibilidade
      });

      const analise = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare o texto original com a versão reescrita e forneça métricas:
        
        ORIGINAL: ${textoOriginal}
        REESCRITO: ${textoReescrito}
        
        Retorne análise estruturada.`,
        response_json_schema: {
          type: "object",
          properties: {
            melhorias: { type: "array", items: { type: "string" } },
            score_legibilidade: { type: "number" },
            score_conversao: { type: "number" },
            palavras_originais: { type: "number" },
            palavras_reescritas: { type: "number" }
          }
        }
      });

      setResultado({
        texto_reescrito: textoReescrito,
        analise
      });

      toast.success('Texto reescrito com sucesso');
    } catch (error) {
      console.error('Erro ao reescrever:', error);
      setErro(error.message || 'Erro ao reescrever texto');
      toast.error('Erro ao reescrever texto');
    } finally {
      setReescrevendo(false);
    }
  };

  const aplicarReescrita = () => {
    if (resultado?.texto_reescrito && onTextoReescrito) {
      onTextoReescrito(resultado.texto_reescrito);
      toast.success('Texto aplicado!');
    }
  };

  return (
    <Card className="p-4 sm:p-6 border-2">
      <ReescritaHeader
        reescrevendo={reescrevendo}
        objetivo={objetivoAtual}
        onObjetivoChange={setObjetivoAtual}
        onReescrever={reescreverTexto}
        disabled={!textoOriginal || textoOriginal.length < 50}
      />

      {reescrevendo && <ReescritaLoading objetivo={objetivoAtual} />}

      {erro && !reescrevendo && (
        <div className="text-center py-4 text-red-600" role="alert">
          <p className="text-xs sm:text-sm">{erro}</p>
        </div>
      )}

      {!reescrevendo && !resultado && !erro && <ReescritaEmpty />}

      {resultado && !reescrevendo && (
        <ReescritaResultado
          resultado={resultado}
          textoOriginal={textoOriginal}
          onAplicar={aplicarReescrita}
        />
      )}
    </Card>
  );
}