import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useCompetitiveAnalysis() {
  const analyzeMutation = useMutation({
    mutationFn: async (url) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um especialista em SEO e análise de concorrência.

Analise a seguinte URL de um escritório de advocacia concorrente: ${url}

Simule uma análise profissional e forneça:
1. 8-10 palavras-chave principais que o site provavelmente está focando (relacionadas a direito do consumidor)
2. 5-7 tópicos de artigos/conteúdo de sucesso que eles provavelmente têm
3. 5-7 lacunas de conteúdo (oportunidades para nosso escritório criar conteúdo único)

Seja específico e focado no nicho de direito do consumidor e superendividamento.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            keywords: {
              type: "array",
              items: { type: "string" }
            },
            topicos: {
              type: "array",
              items: { type: "string" }
            },
            lacunas: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      return response;
    },
    onSuccess: () => {
      toast.success('Análise concluída!');
    },
    onError: (error) => {
      toast.error('Erro na análise: ' + error.message);
    }
  });

  return { analyzeMutation };
}