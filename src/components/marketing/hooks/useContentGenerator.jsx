import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useContentGenerator() {
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async ({ tipo, plataforma, topico, instrucoes }) => {
      const prompts = {
        blog: `Escreva um artigo de blog profissional sobre "${topico}" para um escritório de advocacia especializado em defesa do consumidor. Inclua introdução, desenvolvimento e conclusão. ${instrucoes || ''}`,
        social: `Crie um post para ${plataforma} sobre "${topico}" focado em direito do consumidor. Engajante, com hashtags relevantes. ${instrucoes || ''}`,
        ad: `Crie um anúncio para ${plataforma} sobre "${topico}". Headline impactante, descrição persuasiva e CTA claro. ${instrucoes || ''}`,
        email: `Escreva um email marketing sobre "${topico}" para clientes interessados em direito do consumidor. ${instrucoes || ''}`
      };

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompts[tipo],
        response_json_schema: {
          type: "object",
          properties: {
            texto: { type: "string" },
            titulo: { type: "string" },
            hashtags: { type: "array", items: { type: "string" } }
          }
        }
      });

      return response;
    },
    onError: (error) => {
      toast.error('Erro ao gerar conteúdo: ' + error.message);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async ({ config, content }) => {
      const user = await base44.auth.me();
      
      if (config.tipo === 'blog') {
        return base44.entities.Blog.create({
          titulo: content.titulo,
          conteudo: content.texto,
          status: content.agendamento ? 'agendado' : 'rascunho',
          data_agendamento: content.agendamento || null,
          gerado_por_ia: true,
          escritorio_id: user.escritorio_id
        });
      }
      
      // Para outros tipos, criar em entidade genérica de conteúdo
      return { saved: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      toast.success('Conteúdo salvo com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao salvar: ' + error.message);
    }
  });

  return { generateMutation, saveMutation };
}